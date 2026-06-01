using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Models.DTOs.Auth;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Services.Interfaces;

namespace UT.ServiceConsole.API.Controllers
{
    /// <summary>
    /// Authentication endpoints: login, logout, forgot password.
    /// POST /api/auth/login  – public
    /// POST /api/auth/logout – requires valid JWT
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        /// <inheritdoc />
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Authenticates a user and returns a signed JWT access token.
        /// </summary>
        /// <remarks>
        /// Dummy credentials for local testing:
        ///   admin@utconsole.com / Admin@2026!
        ///   john.doe@utconsole.com / Service@2026!
        ///   budi.santoso@utconsole.com / Mechanic@2026!
        ///   manager.user@utconsole.com / Manager@2026!
        /// </remarks>
        /// <param name="request">Email + password credentials.</param>
        /// <returns>200 OK with JWT on success; 401 on bad credentials; 400 on validation error.</returns>
        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<LoginResponse>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 401)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail("Validation failed.",
                    ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()));

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var ua = Request.Headers["User-Agent"].ToString();

            var result = await _authService.LoginAsync(request, ip, ua);

            if (!result.Success)
            {
                _logger.LogWarning("Login failed for: {Email}", request.Email);
                return Unauthorized(ApiResponse<LoginResponse>.Fail(result.Message));
            }

            return Ok(ApiResponse<LoginResponse>.Ok(result, "Login successful."));
        }

        /// <summary>
        /// Logs out the current user and records the logout timestamp.
        /// </summary>
        /// <returns>200 OK on success.</returns>
        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Logout()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized(ApiResponse<object>.Fail("Invalid token."));

            await _authService.LogoutAsync(userId);
            return Ok(ApiResponse<object>.Ok(null, "Logged out successfully."));
        }

        /// <summary>
        /// Initiates a password reset email flow.
        /// Always returns 200 to prevent user enumeration.
        /// </summary>
        /// <param name="email">Registered email address.</param>
        /// <returns>200 OK always.</returns>
        [HttpPost("forgot-password")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            await _authService.ForgotPasswordAsync(email);
            return Ok(ApiResponse<object>.Ok(null,
                "If that email is registered you will receive a reset link shortly."));
        }

        /// <summary>
        /// Registers a new user account. Password is hashed server-side; never stored in plain text.
        /// </summary>
        /// <param name="request">Registration details: username, email, password, optional profile fields.</param>
        /// <returns>201 Created with new user info on success; 409 Conflict if email/username taken; 400 on validation error.</returns>
        [HttpPost("register")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<RegisterResponse>), 201)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 409)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail("Validation failed.",
                    ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()));

            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
            {
                _logger.LogWarning("Registration failed: {Message}", result.Message);
                return Conflict(ApiResponse<RegisterResponse>.Fail(result.Message));
            }

            return StatusCode(201, ApiResponse<RegisterResponse>.Ok(result, result.Message));
        }

        /// <summary>Returns information about the currently authenticated user.</summary>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(401)]
        public IActionResult Me()
        {
            var claims = new
            {
                UserId   = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Username = User.FindFirst(ClaimTypes.Name)?.Value,
                Email    = User.FindFirst(ClaimTypes.Email)?.Value,
                Role     = User.FindFirst(ClaimTypes.Role)?.Value
            };
            return Ok(ApiResponse<object>.Ok(claims));
        }
    }
}
