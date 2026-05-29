using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using UT.ServiceConsole.API.Configurations;

namespace UT.ServiceConsole.API.Middleware
{
    /// <summary>
    /// Validates the JWT Bearer token on every request that carries one.
    /// Invalid tokens are rejected with 401 before reaching any controller.
    /// Endpoints decorated with [AllowAnonymous] bypass this check via the built-in
    /// ASP.NET Core authentication middleware (this middleware runs in addition to it
    /// to provide detailed logging).
    /// </summary>
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<JwtMiddleware> _logger;

        /// <inheritdoc />
        public JwtMiddleware(RequestDelegate next, JwtSettings jwtSettings, ILogger<JwtMiddleware> logger)
        {
            _next = next;
            _jwtSettings = jwtSettings;
            _logger = logger;
        }

        /// <summary>Intercepts each request, extracts and validates the Bearer token if present.</summary>
        public async Task InvokeAsync(HttpContext context)
        {
            var token = ExtractToken(context);

            if (token != null)
            {
                var (isValid, errorMessage) = ValidateToken(token);
                if (!isValid)
                {
                    _logger.LogWarning("Invalid JWT token on {Path}: {Error}",
                        context.Request.Path, errorMessage);

                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(
                        $"{{\"success\":false,\"message\":\"Unauthorized: {errorMessage}\"}}");
                    return;
                }

                _logger.LogDebug("Valid JWT token on {Path}", context.Request.Path);
            }

            await _next(context);
        }

        // ─────────────────────────────── private ─────────────────────────────

        private static string? ExtractToken(HttpContext context)
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                return authHeader["Bearer ".Length..].Trim();

            return null;
        }

        private (bool IsValid, string Error) ValidateToken(string token)
        {
            try
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
                var handler = new JwtSecurityTokenHandler();

                handler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidIssuer              = _jwtSettings.Issuer,
                    ValidateAudience         = true,
                    ValidAudience            = _jwtSettings.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey         = key,
                    ValidateLifetime         = true,
                    ClockSkew                = TimeSpan.FromMinutes(1)
                }, out _);

                return (true, string.Empty);
            }
            catch (SecurityTokenExpiredException)
            {
                return (false, "Token has expired.");
            }
            catch (SecurityTokenException ex)
            {
                return (false, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during token validation.");
                return (false, "Token validation error.");
            }
        }
    }
}
