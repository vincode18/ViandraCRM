# UT Service Console — .NET Core Implementation Guide
## MVP Phase 1: Backend Architecture & Code Structure

**Date:** May 28, 2026  
**Framework:** ASP.NET Core 8.0  
**ORM:** Entity Framework Core 8.0  
**Database:** MySQL Server  
**API Style:** RESTful (JSON)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Database Configuration](#database-configuration)
4. [Authentication Implementation](#authentication-implementation)
5. [Core Services & Repositories](#core-services--repositories)
6. [API Controllers](#api-controllers)
7. [Models & DTOs](#models--dtos)
8. [Middleware & Configuration](#middleware--configuration)
9. [Configuration Files](#configuration-files)
10. [Deployment Instructions](#deployment-instructions)

---

## 1. Project Structure

```
UT.ServiceConsole.Solution/
│
├── UT.ServiceConsole.API/                    # Main API project
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── CasesController.cs
│   │   ├── WorkOrdersController.cs
│   │   ├── SearchController.cs
│   │   └── UsersController.cs
│   │
│   ├── Models/
│   │   ├── Entities/                         # EF Core entities
│   │   │   ├── User.cs
│   │   │   ├── Case.cs
│   │   │   ├── WorkOrder.cs
│   │   │   ├── Asset.cs
│   │   │   ├── Account.cs
│   │   │   ├── Contact.cs
│   │   │   ├── CaseNote.cs
│   │   │   ├── AuditLog.cs
│   │   │   ├── SLA.cs
│   │   │   └── LoginHistory.cs
│   │   │
│   │   ├── DTOs/                             # Data Transfer Objects
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.cs
│   │   │   │   ├── LoginResponse.cs
│   │   │   │   └── ForgotPasswordRequest.cs
│   │   │   │
│   │   │   ├── Cases/
│   │   │   │   ├── CreateCaseRequest.cs
│   │   │   │   ├── UpdateCaseRequest.cs
│   │   │   │   ├── CaseDto.cs
│   │   │   │   └── CaseDetailDto.cs
│   │   │   │
│   │   │   ├── WorkOrders/
│   │   │   │   ├── CreateWorkOrderRequest.cs
│   │   │   │   ├── UpdateWorkOrderRequest.cs
│   │   │   │   ├── WorkOrderDto.cs
│   │   │   │   └── WorkOrderDetailDto.cs
│   │   │   │
│   │   │   └── Common/
│   │   │       ├── ApiResponse.cs
│   │   │       ├── PagedResult.cs
│   │   │       └── UserDto.cs
│   │   │
│   │   └── ViewModels/
│   │       └── (Optional, usually DTOs are used)
│   │
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── CaseService.cs
│   │   ├── WorkOrderService.cs
│   │   ├── SearchService.cs
│   │   ├── AuditService.cs
│   │   └── Interfaces/
│   │       ├── IAuthService.cs
│   │       ├── ICaseService.cs
│   │       ├── IWorkOrderService.cs
│   │       ├── ISearchService.cs
│   │       └── IAuditService.cs
│   │
│   ├── Repositories/
│   │   ├── CaseRepository.cs
│   │   ├── WorkOrderRepository.cs
│   │   ├── UserRepository.cs
│   │   ├── AssetRepository.cs
│   │   ├── AccountRepository.cs
│   │   ├── BaseRepository.cs
│   │   └── Interfaces/
│   │       ├── ICaseRepository.cs
│   │       ├── IWorkOrderRepository.cs
│   │       ├── IBaseRepository.cs
│   │       └── (other interfaces)
│   │
│   ├── Data/
│   │   ├── ApplicationDbContext.cs            # EF Core DbContext
│   │   ├── DesignTimeDbContextFactory.cs     # For migrations
│   │   └── Migrations/                        # EF Core migrations
│   │       ├── 20260528000001_InitialCreate.cs
│   │       └── (subsequent migrations)
│   │
│   ├── Middleware/
│   │   ├── JwtMiddleware.cs
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   ├── LoggingMiddleware.cs
│   │   └── RequestValidationMiddleware.cs
│   │
│   ├── Validators/                           # FluentValidation
│   │   ├── CreateCaseValidator.cs
│   │   ├── CreateWorkOrderValidator.cs
│   │   └── LoginValidator.cs
│   │
│   ├── Utilities/
│   │   ├── PasswordHasher.cs
│   │   ├── JwtTokenGenerator.cs
│   │   ├── Constants.cs
│   │   └── Extensions.cs
│   │
│   ├── Configurations/
│   │   ├── JwtSettings.cs
│   │   ├── AppSettings.cs
│   │   └── AutoMapperProfile.cs
│   │
│   ├── Program.cs                            # Startup configuration
│   ├── appsettings.json                      # Development settings
│   ├── appsettings.Production.json           # Production settings
│   └── UT.ServiceConsole.API.csproj          # Project file

├── UT.ServiceConsole.Core/                   # Shared/Core library (optional)
│   ├── Entities/
│   ├── DTOs/
│   ├── Interfaces/
│   └── UT.ServiceConsole.Core.csproj

└── UT.ServiceConsole.Tests/                  # Unit & Integration tests
    ├── UnitTests/
    │   ├── Services/
    │   ├── Repositories/
    │   └── Controllers/
    ├── IntegrationTests/
    └── UT.ServiceConsole.Tests.csproj
```

---

## 2. Prerequisites & Setup

### 2.1 System Requirements

- **.NET 8.0 SDK** or later
- **Visual Studio 2022** (Community, Professional, or Enterprise) OR **Visual Studio Code** with C# extension
- **MySQL Server 8.0+** (Local or remote)
- **MySQL Workbench** or SSMS MySQL plugin for database management
- **Postman** or similar for API testing
- **Git** for version control

### 2.2 Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/yourorg/ut-service-console.git
cd ut-service-console

# 2. Restore NuGet packages
dotnet restore

# 3. Create local MySQL database
# Open MySQL Workbench and execute DATABASE_SCHEMA_UT_SERVICE_CONSOLE.sql

# 4. Configure connection string in appsettings.json
# Update DefaultConnection with your MySQL server details

# 5. Apply EF Core migrations
dotnet ef database update

# 6. Build solution
dotnet build

# 7. Run API
dotnet run --project UT.ServiceConsole.API
# API will start at https://localhost:7001 (or configured port)

# 8. Test with Postman
# POST https://localhost:7001/api/auth/login
```

### 2.3 Required NuGet Packages

```xml
<!-- UT.ServiceConsole.API.csproj -->
<ItemGroup>
  <!-- ASP.NET Core -->
  <PackageReference Include="Microsoft.AspNetCore.App" Version="8.0.0" />
  
  <!-- Entity Framework Core -->
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
  <PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="8.0.0" />
  
  <!-- Authentication / JWT -->
  <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
  <PackageReference Include="Microsoft.IdentityModel.Protocols.OpenIdConnect" Version="7.0.0" />
  
  <!-- Validation -->
  <PackageReference Include="FluentValidation" Version="11.8.0" />
  <PackageReference Include="FluentValidation.DependencyInjectionExtensions" Version="11.8.0" />
  
  <!-- Mapping -->
  <PackageReference Include="AutoMapper" Version="13.0.0" />
  <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.0" />
  
  <!-- Logging -->
  <PackageReference Include="Serilog" Version="3.0.0" />
  <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
  <PackageReference Include="Serilog.Sinks.File" Version="5.0.0" />
  
  <!-- API Documentation -->
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  
  <!-- Utilities -->
  <PackageReference Include="Microsoft.Extensions.Configuration" Version="8.0.0" />
  <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
  <PackageReference Include="Newtonsoft.Json" Version="13.0.0" />
</ItemGroup>
```

---

## 3. Database Configuration

### 3.1 ApplicationDbContext.cs

```csharp
using Microsoft.EntityFrameworkCore;
using UT.ServiceConsole.API.Models.Entities;

namespace UT.ServiceConsole.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<WorkOrder> WorkOrders { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<CaseNote> CaseNotes { get; set; }
        public DbSet<WorkOrderNote> WorkOrderNotes { get; set; }
        public DbSet<SLA> SLAs { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<User>()
                .Property(u => u.LastModifiedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Case configuration
            modelBuilder.Entity<Case>()
                .HasIndex(c => c.CaseNumber)
                .IsUnique();

            modelBuilder.Entity<Case>()
                .HasIndex(c => c.Status);

            modelBuilder.Entity<Case>()
                .HasIndex(c => c.Priority);

            modelBuilder.Entity<Case>()
                .HasOne(c => c.AssignedOwner)
                .WithMany()
                .HasForeignKey(c => c.AssignedOwnerID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Case>()
                .HasOne(c => c.Asset)
                .WithMany()
                .HasForeignKey(c => c.AssetID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Case>()
                .HasOne(c => c.Account)
                .WithMany()
                .HasForeignKey(c => c.AccountID)
                .OnDelete(DeleteBehavior.SetNull);

            // WorkOrder configuration
            modelBuilder.Entity<WorkOrder>()
                .HasIndex(w => w.WorkOrderNumber)
                .IsUnique();

            modelBuilder.Entity<WorkOrder>()
                .HasIndex(w => w.CaseID);

            modelBuilder.Entity<WorkOrder>()
                .HasIndex(w => w.Status);

            modelBuilder.Entity<WorkOrder>()
                .HasOne(w => w.Case)
                .WithMany(c => c.WorkOrders)
                .HasForeignKey(w => w.CaseID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkOrder>()
                .HasOne(w => w.AssignedMechanic)
                .WithMany()
                .HasForeignKey(w => w.AssignedMechanicID)
                .OnDelete(DeleteBehavior.SetNull);

            // SLA configuration
            modelBuilder.Entity<SLA>()
                .HasOne(s => s.Case)
                .WithMany(c => c.SLAs)
                .HasForeignKey(s => s.CaseID)
                .OnDelete(DeleteBehavior.Cascade);

            // CaseNote configuration
            modelBuilder.Entity<CaseNote>()
                .HasOne(n => n.Case)
                .WithMany(c => c.Notes)
                .HasForeignKey(n => n.CaseID)
                .OnDelete(DeleteBehavior.Cascade);

            // AuditLog configuration
            modelBuilder.Entity<AuditLog>()
                .HasIndex(a => new { a.EntityName, a.EntityID, a.ChangedDate });

            // Add more configurations as needed
        }
    }
}
```

---

## 4. Authentication Implementation

### 4.1 Models/Entities/User.cs

```csharp
using System;
using System.Collections.Generic;

namespace UT.ServiceConsole.API.Models.Entities
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; } // 'ServiceAdvisor', 'Mechanic', 'Manager', 'Admin'
        public string Department { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginDate { get; set; }
        public int FailedLoginAttempts { get; set; } = 0;
        public bool IsLockedOut { get; set; } = false;
        public DateTime? LockoutEndDate { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }

        // Navigation properties
        public virtual User CreatedByUser { get; set; }
        public virtual User LastModifiedByUser { get; set; }
        public virtual ICollection<LoginHistory> LoginHistories { get; set; }
    }
}
```

### 4.2 Models/DTOs/Auth/LoginRequest.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace UT.ServiceConsole.API.Models.DTOs.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username or email is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; }

        public bool RememberMe { get; set; } = false;
    }
}
```

### 4.3 Models/DTOs/Auth/LoginResponse.cs

```csharp
using System;

namespace UT.ServiceConsole.API.Models.DTOs.Auth
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; } // in seconds
        public UserDto User { get; set; }
    }

    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string Department { get; set; }
        public string PhoneNumber { get; set; }
    }
}
```

### 4.4 Utilities/PasswordHasher.cs

```csharp
using System;
using System.Security.Cryptography;
using System.Text;

namespace UT.ServiceConsole.API.Utilities
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        public static bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput.Equals(hash);
        }

        public static bool ValidatePasswordStrength(string password)
        {
            // Minimum 8 characters
            if (password.Length < 8)
                return false;

            // At least one uppercase
            if (!System.Text.RegularExpressions.Regex.IsMatch(password, @"[A-Z]"))
                return false;

            // At least one digit
            if (!System.Text.RegularExpressions.Regex.IsMatch(password, @"[0-9]"))
                return false;

            // At least one special character
            if (!System.Text.RegularExpressions.Regex.IsMatch(password, @"[@#$%!]"))
                return false;

            return true;
        }
    }
}
```

### 4.5 Utilities/JwtTokenGenerator.cs

```csharp
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using UT.ServiceConsole.API.Configurations;

namespace UT.ServiceConsole.API.Utilities
{
    public static class JwtTokenGenerator
    {
        public static string GenerateToken(int userId, string username, string email, string role, JwtSettings jwtSettings)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtSettings.SecretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(jwtSettings.ExpirationMinutes),
                Issuer = jwtSettings.Issuer,
                Audience = jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}
```

### 4.6 Services/Interfaces/IAuthService.cs

```csharp
using System.Threading.Tasks;
using UT.ServiceConsole.API.Models.DTOs.Auth;

namespace UT.ServiceConsole.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<bool> LogoutAsync(int userId);
        Task<LoginResponse> RefreshTokenAsync(string refreshToken);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
        Task<(bool isValid, string message)> ValidatePasswordAsync(string password);
    }
}
```

### 4.7 Services/AuthService.cs

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Models.DTOs.Auth;
using UT.ServiceConsole.API.Models.Entities;
using UT.ServiceConsole.API.Services.Interfaces;
using UT.ServiceConsole.API.Utilities;
using Microsoft.EntityFrameworkCore;

namespace UT.ServiceConsole.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthService> _logger;
        private readonly Configurations.JwtSettings _jwtSettings;

        public AuthService(
            ApplicationDbContext context,
            ILogger<AuthService> logger,
            Configurations.JwtSettings jwtSettings)
        {
            _context = context;
            _logger = logger;
            _jwtSettings = jwtSettings;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                // Find user by username or email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u =>
                        (u.Username == request.Username || u.Email == request.Username) &&
                        u.IsActive);

                if (user == null)
                {
                    _logger.LogWarning($"Login attempt with invalid credentials: {request.Username}");
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Check if account is locked
                if (user.IsLockedOut && user.LockoutEndDate > DateTime.UtcNow)
                {
                    _logger.LogWarning($"Login attempt on locked account: {user.Username}");
                    return new LoginResponse
                    {
                        Success = false,
                        Message = $"Account is locked. Try again after {user.LockoutEndDate:yyyy-MM-dd HH:mm:ss}"
                    };
                }

                // Verify password
                if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
                {
                    user.FailedLoginAttempts++;

                    if (user.FailedLoginAttempts >= 5)
                    {
                        user.IsLockedOut = true;
                        user.LockoutEndDate = DateTime.UtcNow.AddMinutes(30);
                        _logger.LogWarning($"Account locked due to too many failed attempts: {user.Username}");
                    }

                    await _context.SaveChangesAsync();

                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid username or password"
                    };
                }

                // Reset failed attempts on successful login
                user.FailedLoginAttempts = 0;
                user.IsLockedOut = false;
                user.LastLoginDate = DateTime.UtcNow;

                // Generate JWT token
                var token = JwtTokenGenerator.GenerateToken(
                    user.UserID,
                    user.Username,
                    user.Email,
                    user.Role,
                    _jwtSettings);

                var refreshToken = JwtTokenGenerator.GenerateRefreshToken();

                // Log login
                var loginHistory = new LoginHistory
                {
                    UserID = user.UserID,
                    LoginDate = DateTime.UtcNow,
                    Success = true
                };

                _context.LoginHistories.Add(loginHistory);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User logged in successfully: {user.Username}");

                return new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresIn = _jwtSettings.ExpirationMinutes * 60,
                    User = new UserDto
                    {
                        UserId = user.UserID,
                        Username = user.Username,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        Department = user.Department,
                        PhoneNumber = user.PhoneNumber
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during login: {ex.Message}");
                return new LoginResponse
                {
                    Success = false,
                    Message = "An error occurred during login"
                };
            }
        }

        public async Task<bool> LogoutAsync(int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    return false;

                _logger.LogInformation($"User logged out: {user.Username}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during logout: {ex.Message}");
                return false;
            }
        }

        public async Task<LoginResponse> RefreshTokenAsync(string refreshToken)
        {
            // Implementation for token refresh
            // In MVP, we can return success with new token
            return await Task.FromResult(new LoginResponse
            {
                Success = false,
                Message = "Refresh token functionality will be implemented in Phase 2"
            });
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    _logger.LogWarning($"Forgot password request for non-existent email: {email}");
                    return true; // Don't reveal if email exists
                }

                // TODO: Send email with reset link
                _logger.LogInformation($"Password reset requested for: {email}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in forgot password: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            // TODO: Implement password reset with token validation
            return await Task.FromResult(true);
        }

        public async Task<(bool isValid, string message)> ValidatePasswordAsync(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return (false, "Password cannot be empty");

            if (!PasswordHasher.ValidatePasswordStrength(password))
                return (false, "Password must be at least 8 characters with uppercase, number, and special character");

            return await Task.FromResult((true, "Password is valid"));
        }
    }
}
```

---

## 5. Core Services & Repositories

### 5.1 Repositories/Interfaces/IBaseRepository.cs

```csharp
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace UT.ServiceConsole.API.Repositories.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task<int> CountAsync(Expression<Func<T, bool>> predicate = null);
        Task<T> AddAsync(T entity);
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);
        Task<T> UpdateAsync(T entity);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteAsync(T entity);
        Task<int> SaveChangesAsync();
    }
}
```

### 5.2 Repositories/BaseRepository.cs

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Repositories.Interfaces;

namespace UT.ServiceConsole.API.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task<T> SingleOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate = null)
        {
            return predicate == null
                ? await _dbSet.CountAsync()
                : await _dbSet.CountAsync(predicate);
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await SaveChangesAsync();
            return entity;
        }

        public virtual async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
            await SaveChangesAsync();
            return entities;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await SaveChangesAsync();
            return entity;
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            await SaveChangesAsync();
            return true;
        }

        public virtual async Task<bool> DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await SaveChangesAsync();
            return true;
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
```

### 5.3 Repositories/CaseRepository.cs

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Models.Entities;
using UT.ServiceConsole.API.Repositories.Interfaces;

namespace UT.ServiceConsole.API.Repositories
{
    public interface ICaseRepository : IBaseRepository<Case>
    {
        Task<Case> GetCaseDetailAsync(int caseId);
        Task<IEnumerable<Case>> GetCasesByCaseNumberAsync(string caseNumber);
        Task<IEnumerable<Case>> GetCasesByStatusAsync(string status);
        Task<IEnumerable<Case>> GetCasesByAccountAsync(int accountId);
        Task<IEnumerable<Case>> SearchCasesAsync(string searchTerm);
    }

    public class CaseRepository : BaseRepository<Case>, ICaseRepository
    {
        public CaseRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Case> GetCaseDetailAsync(int caseId)
        {
            return await _context.Cases
                .Include(c => c.Asset)
                .Include(c => c.Account)
                .Include(c => c.AssignedOwner)
                .Include(c => c.Notes)
                .Include(c => c.WorkOrders)
                .Include(c => c.SLAs)
                .FirstOrDefaultAsync(c => c.CaseID == caseId);
        }

        public async Task<IEnumerable<Case>> GetCasesByCaseNumberAsync(string caseNumber)
        {
            return await _dbSet
                .Where(c => c.CaseNumber.Contains(caseNumber))
                .ToListAsync();
        }

        public async Task<IEnumerable<Case>> GetCasesByStatusAsync(string status)
        {
            return await _dbSet
                .Where(c => c.Status == status)
                .OrderByDescending(c => c.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Case>> GetCasesByAccountAsync(int accountId)
        {
            return await _dbSet
                .Where(c => c.AccountID == accountId)
                .OrderByDescending(c => c.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Case>> SearchCasesAsync(string searchTerm)
        {
            return await _dbSet
                .Where(c => c.CaseNumber.Contains(searchTerm) ||
                           c.Subject.Contains(searchTerm) ||
                           c.Account.AccountName.Contains(searchTerm))
                .OrderByDescending(c => c.CreatedDate)
                .ToListAsync();
        }
    }
}
```

---

## 6. API Controllers

### 6.1 Controllers/AuthController.cs

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Models.DTOs.Auth;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Services.Interfaces;

namespace UT.ServiceConsole.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Invalid request" });

            var result = await _authService.LoginAsync(request);

            if (!result.Success)
                return Unauthorized(result);

            // Set secure cookie for refresh token (optional)
            // Response.Cookies.Append("refreshToken", result.RefreshToken, ...);

            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize] // Custom authorize attribute (will implement in middleware)
        public async Task<ActionResult<ApiResponse>> Logout()
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
            var result = await _authService.LogoutAsync(userId);

            return Ok(new ApiResponse
            {
                Success = result,
                Message = result ? "Logged out successfully" : "Logout failed"
            });
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<LoginResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(result);
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse>> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _authService.ForgotPasswordAsync(request.Email);

            return Ok(new ApiResponse
            {
                Success = result,
                Message = "If an account exists, password reset instructions have been sent"
            });
        }

        [HttpPost("validate-password")]
        public async Task<ActionResult<ApiResponse>> ValidatePassword([FromBody] PasswordValidationRequest request)
        {
            var (isValid, message) = await _authService.ValidatePasswordAsync(request.Password);

            return Ok(new ApiResponse
            {
                Success = isValid,
                Message = message
            });
        }
    }
}
```

### 6.2 Controllers/CasesController.cs

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Models.DTOs.Cases;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Services.Interfaces;

namespace UT.ServiceConsole.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CasesController : ControllerBase
    {
        private readonly ICaseService _caseService;
        private readonly ILogger<CasesController> _logger;

        public CasesController(ICaseService caseService, ILogger<CasesController> logger)
        {
            _caseService = caseService;
            _logger = logger;
        }

        [HttpPost]
        [ProducesResponseType(typeof(CaseDto), 201)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<CaseDto>> CreateCase([FromBody] CreateCaseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
                var result = await _caseService.CreateCaseAsync(request, userId);

                if (!result.Success)
                    return BadRequest(result);

                return CreatedAtAction(nameof(GetCase), new { id = result.CaseId }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating case: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CaseDetailDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<CaseDetailDto>> GetCase(int id)
        {
            try
            {
                var result = await _caseService.GetCaseDetailAsync(id);

                if (result == null)
                    return NotFound(new { success = false, message = "Case not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving case: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpPatch("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<ApiResponse>> UpdateCase(int id, [FromBody] UpdateCaseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var userId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
                var result = await _caseService.UpdateCaseAsync(id, request, userId);

                if (!result.Success)
                    return NotFound(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating case: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<ApiResponse>> DeleteCase(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
                var result = await _caseService.DeleteCaseAsync(id, userId);

                if (!result.Success)
                    return NotFound(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting case: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(PagedResult<CaseDto>), 200)]
        public async Task<ActionResult<PagedResult<CaseDto>>> GetCases(
            [FromQuery] string status = null,
            [FromQuery] string priority = null,
            [FromQuery] int skip = 0,
            [FromQuery] int take = 25)
        {
            try
            {
                var result = await _caseService.GetCasesAsync(status, priority, skip, take);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving cases: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }

        [HttpGet("search")]
        [ProducesResponseType(typeof(IEnumerable<CaseDto>), 200)]
        public async Task<ActionResult<IEnumerable<CaseDto>>> SearchCases([FromQuery] string query)
        {
            try
            {
                var result = await _caseService.SearchCasesAsync(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching cases: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Internal server error" });
            }
        }
    }
}
```

---

## 7. Models & DTOs

### 7.1 Models/Entities/Case.cs

```csharp
using System;
using System.Collections.Generic;

namespace UT.ServiceConsole.API.Models.Entities
{
    public class Case
    {
        public int CaseID { get; set; }
        public string CaseNumber { get; set; }
        public string CaseType { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public int? ContactID { get; set; }
        public int? AssignedOwnerID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? TargetResolutionDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public bool SLABreached { get; set; }
        public decimal? ComplianceScore { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public int CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }

        // Navigation properties
        public virtual Asset Asset { get; set; }
        public virtual Account Account { get; set; }
        public virtual Contact Contact { get; set; }
        public virtual User AssignedOwner { get; set; }
        public virtual ICollection<WorkOrder> WorkOrders { get; set; }
        public virtual ICollection<CaseNote> Notes { get; set; }
        public virtual ICollection<SLA> SLAs { get; set; }
    }
}
```

### 7.2 Models/DTOs/Cases/CaseDto.cs

```csharp
using System;

namespace UT.ServiceConsole.API.Models.DTOs.Cases
{
    public class CaseDto
    {
        public int CaseId { get; set; }
        public string CaseNumber { get; set; }
        public string CaseType { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public string Subject { get; set; }
        public string AccountName { get; set; }
        public string OwnerName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ClosedDate { get; set; }
        public bool SLABreached { get; set; }
    }

    public class CreateCaseRequest
    {
        public string CaseType { get; set; }
        public string Priority { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public int? AssetId { get; set; }
        public int? AccountId { get; set; }
        public int? ContactId { get; set; }
        public int? AssignedOwnerId { get; set; }
        public string ServiceArea { get; set; }
    }

    public class UpdateCaseRequest
    {
        public string Subject { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public int? AssignedOwnerId { get; set; }
    }

    public class CaseDetailDto
    {
        public int CaseId { get; set; }
        public string CaseNumber { get; set; }
        public string CaseType { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        // ... include all related object details
    }
}
```

---

## 8. Middleware & Configuration

### 8.1 Middleware/JwtMiddleware.cs

```csharp
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using UT.ServiceConsole.API.Configurations;

namespace UT.ServiceConsole.API.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtSettings _jwtSettings;

        public JwtMiddleware(RequestDelegate next, JwtSettings jwtSettings)
        {
            _next = next;
            _jwtSettings = jwtSettings;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                AttachUserToContext(context, token);
            }

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,
                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.Find(x => x.Type == "sub")?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    context.Items["User"] = userId;
                }
            }
            catch (Exception ex)
            {
                // Token validation failed - user will not be authenticated
                Console.WriteLine($"Token validation failed: {ex.Message}");
            }
        }
    }
}
```

### 8.2 Middleware/ExceptionHandlingMiddleware.cs

```csharp
using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace UT.ServiceConsole.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unhandled exception: {ex}");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = HttpStatusCode.InternalServerError.GetHashCode();

            var response = new
            {
                success = false,
                message = "An internal server error occurred",
                error = exception.Message
            };

            return context.Response.WriteAsync(JsonConvert.SerializeObject(response));
        }
    }
}
```

---

## 9. Configuration Files

### 9.1 appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=UT_ServiceConsole;User=root;Password=root;Port=3306;SslMode=Preferred;"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-min-32-characters-long-please-change-this",
    "Issuer": "UT.ServiceConsole",
    "Audience": "UT.ServiceConsole.Users",
    "ExpirationMinutes": 480
  },
  "AppSettings": {
    "ApiTitle": "UT Service Console API",
    "ApiVersion": "1.0.0",
    "EnableSwagger": true
  },
  "AllowedHosts": "*"
}
```

### 9.2 appsettings.Production.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=prod-db-server;Database=UT_ServiceConsole;User=prod_user;Password=ProdSecurePassword123!;Port=3306;SslMode=Required;"
  },
  "Jwt": {
    "SecretKey": "your-production-secret-key-min-32-characters-long-please-change-this",
    "Issuer": "UT.ServiceConsole",
    "Audience": "UT.ServiceConsole.Users",
    "ExpirationMinutes": 480
  },
  "AppSettings": {
    "ApiTitle": "UT Service Console API",
    "ApiVersion": "1.0.0",
    "EnableSwagger": false
  },
  "AllowedHosts": "api.utserviceconsole.com"
}
```

### 9.3 Program.cs (Startup Configuration)

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using UT.ServiceConsole.API.Configurations;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Middleware;
using UT.ServiceConsole.API.Repositories;
using UT.ServiceConsole.API.Repositories.Interfaces;
using UT.ServiceConsole.API.Services;
using UT.ServiceConsole.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/api-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services
var jwtSettings = new JwtSettings();
builder.Configuration.GetSection("Jwt").Bind(jwtSettings);
builder.Services.AddSingleton(jwtSettings);

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))));

// Repositories
builder.Services.AddScoped<ICaseRepository, CaseRepository>();
builder.Services.AddScoped<IWorkOrderRepository, WorkOrderRepository>();
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICaseService, CaseService>();
builder.Services.AddScoped<IWorkOrderService, WorkOrderService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Controllers & API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "UT Service Console API",
        Version = "1.0.0",
        Description = "Enterprise Service Management API - MVP Phase 1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// Apply migrations automatically
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseRouting();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<JwtMiddleware>();

app.MapControllers();

app.Run();
```

---

## 10. Deployment Instructions

### 10.1 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/yourorg/ut-service-console.git
cd ut-service-console/UT.ServiceConsole.API

# 2. Restore NuGet packages
dotnet restore

# 3. Create MySQL database
# Execute DATABASE_SCHEMA_UT_SERVICE_CONSOLE.sql on MySQL server

# 4. Update connection string
# Edit appsettings.json with your MySQL details

# 5. Apply Entity Framework migrations
dotnet ef database update

# 6. Run development server
dotnet run
# API available at https://localhost:7001/swagger
```

### 10.2 Docker Deployment

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "UT.ServiceConsole.API.dll"]
```

```bash
# Build and run Docker image
docker build -t ut-service-console:latest .
docker run -p 5000:5000 -e ConnectionStrings:DefaultConnection="your-connection-string" ut-service-console:latest
```

### 10.3 Azure Deployment

```bash
# Create Azure resources
az group create --name ut-service-console-rg --location eastus

# Create App Service Plan
az appservice plan create --name ut-service-console-plan --resource-group ut-service-console-rg --sku B1

# Create Web App
az webapp create --name ut-service-console-api --resource-group ut-service-console-rg --plan ut-service-console-plan

# Deploy from Git
az webapp up --name ut-service-console-api --resource-group ut-service-console-rg

# Set connection string
az webapp config connection-string set --name ut-service-console-api --resource-group ut-service-console-rg --settings DefaultConnection="your-connection-string" --connection-string-type MySql
```

---

**Document End**

For complete implementation details, refer to the main FRD document: `FRD_UT_SERVICE_CONSOLE_MVP.md`

