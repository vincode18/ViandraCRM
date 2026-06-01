using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Configurations;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Models.DTOs.Auth;
using UT.ServiceConsole.API.Models.Entities;
using UT.ServiceConsole.API.Services.Interfaces;
using UT.ServiceConsole.API.Utilities;

namespace UT.ServiceConsole.API.Services
{
    /// <summary>
    /// Handles user authentication: credential validation, account lockout (5 attempts / 30 min),
    /// JWT generation (8-hour expiry), and login history recording.
    /// Passwords are never logged at any level.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<AuthService> _logger;
        private readonly JwtSettings _jwtSettings;

        private const int MaxFailedAttempts = 5;
        private const int LockoutMinutes = 30;

        /// <inheritdoc />
        public AuthService(
            ApplicationDbContext db,
            ILogger<AuthService> logger,
            JwtSettings jwtSettings)
        {
            _db = db;
            _logger = logger;
            _jwtSettings = jwtSettings;
        }

        /// <summary>
        /// Validates email/password, enforces lockout policy, and returns a signed JWT on success.
        /// </summary>
        /// <param name="request">Login credentials (password never logged).</param>
        /// <param name="ipAddress">Caller IP for audit trail.</param>
        /// <param name="userAgent">Caller user-agent for audit trail.</param>
        /// <returns><see cref="LoginResponse"/> with JWT on success or error details on failure.</returns>
        public async Task<LoginResponse> LoginAsync(LoginRequest request, string? ipAddress, string? userAgent)
        {
            try
            {
                // Lookup by email or username (case-insensitive)
                var user = await _db.Users
                    .FirstOrDefaultAsync(u =>
                        (u.Email.ToLower() == request.Email.ToLower() ||
                         u.Username.ToLower() == request.Email.ToLower()) &&
                        u.IsActive);

                if (user == null)
                {
                    _logger.LogWarning("Login attempt with unknown identifier: {Identifier}", request.Email);
                    await RecordLoginHistory(null, ipAddress, userAgent, false, "User not found");
                    return Fail("Invalid email or password.");
                }

                // ── Check lockout ──────────────────────────────────────────────
                if (user.IsLockedOut && user.LockoutEndDate.HasValue && user.LockoutEndDate > DateTime.UtcNow)
                {
                    var remaining = (int)(user.LockoutEndDate.Value - DateTime.UtcNow).TotalMinutes + 1;
                    _logger.LogWarning("Login attempt on locked account. UserID={UserId}", user.UserID);
                    await RecordLoginHistory(user.UserID, ipAddress, userAgent, false, "Account locked");
                    return Fail($"Account is locked. Please try again in {remaining} minute(s).");
                }

                // Auto-unlock if lockout period expired
                if (user.IsLockedOut && user.LockoutEndDate.HasValue && user.LockoutEndDate <= DateTime.UtcNow)
                {
                    user.IsLockedOut = false;
                    user.FailedLoginAttempts = 0;
                    user.LockoutEndDate = null;
                }

                // ── Verify password ────────────────────────────────────────────
                if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
                {
                    user.FailedLoginAttempts++;

                    if (user.FailedLoginAttempts >= MaxFailedAttempts)
                    {
                        user.IsLockedOut = true;
                        user.LockoutEndDate = DateTime.UtcNow.AddMinutes(LockoutMinutes);
                        _logger.LogWarning(
                            "Account locked after {Attempts} failed attempts. UserID={UserId}",
                            user.FailedLoginAttempts, user.UserID);
                    }

                    await _db.SaveChangesAsync();
                    await RecordLoginHistory(user.UserID, ipAddress, userAgent, false, "Invalid password");

                    int attemptsLeft = MaxFailedAttempts - user.FailedLoginAttempts;
                    if (attemptsLeft <= 0)
                        return Fail($"Too many failed attempts. Account locked for {LockoutMinutes} minutes.");

                    return Fail($"Invalid email or password. {attemptsLeft} attempt(s) remaining.");
                }

                // ── Successful login ───────────────────────────────────────────
                user.FailedLoginAttempts = 0;
                user.IsLockedOut = false;
                user.LockoutEndDate = null;
                user.LastLoginDate = DateTime.UtcNow;

                var token = JwtTokenGenerator.GenerateToken(
                    user.UserID, user.Username, user.Email, user.Role, _jwtSettings);

                var refreshToken = JwtTokenGenerator.GenerateRefreshToken();

                await RecordLoginHistory(user.UserID, ipAddress, userAgent, true, null);
                await _db.SaveChangesAsync();

                _logger.LogInformation("User authenticated successfully. UserID={UserId} Role={Role}",
                    user.UserID, user.Role);

                return new LoginResponse
                {
                    Success = true,
                    Message = "Login successful.",
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresIn = _jwtSettings.ExpirationMinutes * 60,
                    User = new UserDto
                    {
                        UserId = user.UserID,
                        Username = user.Username,
                        Email = user.Email,
                        FirstName = user.FirstName ?? string.Empty,
                        LastName = user.LastName ?? string.Empty,
                        Role = user.Role,
                        Department = user.Department,
                        PhoneNumber = user.PhoneNumber
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during login for identifier: {Identifier}", request.Email);
                return Fail("An unexpected error occurred. Please try again.");
            }
        }

        /// <summary>Records the logout event (token blacklist deferred to Phase 2).</summary>
        public async Task<bool> LogoutAsync(int userId)
        {
            try
            {
                var history = await _db.LoginHistories
                    .Where(l => l.UserID == userId && l.LogoutDate == null)
                    .OrderByDescending(l => l.LoginDate)
                    .FirstOrDefaultAsync();

                if (history != null)
                {
                    history.LogoutDate = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                }

                _logger.LogInformation("User logged out. UserID={UserId}", userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout. UserID={UserId}", userId);
                return false;
            }
        }

        /// <summary>
        /// Initiates forgot-password flow. Returns true even if email is not found
        /// to prevent user enumeration attacks.
        /// </summary>
        public async Task<bool> ForgotPasswordAsync(string email)
        {
            try
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
                if (user == null)
                {
                    _logger.LogWarning("Forgot-password requested for unknown email (not revealed to caller).");
                    return true; // Do not reveal whether email exists
                }

                // TODO: Generate secure reset token, store hash, send email (Phase 2)
                _logger.LogInformation("Password reset requested. UserID={UserId}", user.UserID);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during forgot-password for email: {Email}", email);
                return false;
            }
        }

        /// <summary>Resets user password after validating reset token.</summary>
        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            // TODO: Validate token from store, update hash (Phase 2)
            await Task.CompletedTask;
            return true;
        }

        // ─────────────────────────────── private ─────────────────────────────

        private async Task RecordLoginHistory(int? userId, string? ip, string? ua, bool success, string? failureReason)
        {
            if (userId == null) return;
            _db.LoginHistories.Add(new LoginHistory
            {
                UserID = userId.Value,
                LoginDate = DateTime.UtcNow,
                IPAddress = ip,
                UserAgent = ua,
                Success = success,
                FailureReason = failureReason
            });
            await _db.SaveChangesAsync();
        }

        /// <summary>
        /// Registers a new user: validates uniqueness, enforces password strength,
        /// hashes password with salt, and persists the user to the database.
        /// </summary>
        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Check email uniqueness
                var emailExists = await _db.Users
                    .AnyAsync(u => u.Email.ToLower() == request.Email.ToLower());
                if (emailExists)
                    return new RegisterResponse { Success = false, Message = "An account with that email already exists." };

                // Check username uniqueness
                var usernameExists = await _db.Users
                    .AnyAsync(u => u.Username.ToLower() == request.Username.ToLower());
                if (usernameExists)
                    return new RegisterResponse { Success = false, Message = "That username is already taken." };

                // Validate password strength
                var (isValid, strengthMsg) = PasswordHasher.ValidateStrength(request.Password);
                if (!isValid)
                    return new RegisterResponse { Success = false, Message = strengthMsg };

                // Hash password
                var passwordHash = PasswordHasher.HashPassword(request.Password);

                // Sanitise role — only allow known roles
                var allowedRoles = new[] { "Admin", "Manager", "ServiceAdvisor", "Mechanic" };
                var role = allowedRoles.Contains(request.Role) ? request.Role : "ServiceAdvisor";

                var user = new User
                {
                    Username     = request.Username.Trim(),
                    Email        = request.Email.Trim().ToLower(),
                    PasswordHash = passwordHash,
                    FirstName    = request.FirstName?.Trim(),
                    LastName     = request.LastName?.Trim(),
                    Role         = role,
                    Department   = request.Department?.Trim(),
                    PhoneNumber  = request.PhoneNumber?.Trim(),
                    IsActive     = true,
                    CreatedDate  = DateTime.UtcNow,
                    LastModifiedDate = DateTime.UtcNow,
                };

                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                _logger.LogInformation("New user registered. UserID={UserId} Email={Email} Role={Role}",
                    user.UserID, user.Email, user.Role);

                return new RegisterResponse
                {
                    Success = true,
                    Message = "Account created successfully.",
                    User = new UserDto
                    {
                        UserId      = user.UserID,
                        Username    = user.Username,
                        Email       = user.Email,
                        FirstName   = user.FirstName ?? string.Empty,
                        LastName    = user.LastName ?? string.Empty,
                        Role        = user.Role,
                        Department  = user.Department,
                        PhoneNumber = user.PhoneNumber,
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during registration for email: {Email}", request.Email);
                return new RegisterResponse { Success = false, Message = "An unexpected error occurred. Please try again." };
            }
        }

        private static LoginResponse Fail(string message) =>
            new() { Success = false, Message = message };
    }
}
