using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using UT.ServiceConsole.API.Configurations;

namespace UT.ServiceConsole.API.Utilities
{
    /// <summary>
    /// Generates and validates JWT access tokens and opaque refresh tokens.
    /// </summary>
    public static class JwtTokenGenerator
    {
        /// <summary>
        /// Creates a signed JWT containing UserID, Email, Username, and Role claims.
        /// Token expiration is driven by <see cref="JwtSettings.ExpirationMinutes"/> (default 480 = 8 h).
        /// </summary>
        /// <param name="userId">Database primary key of the authenticated user.</param>
        /// <param name="username">Login username.</param>
        /// <param name="email">User email address.</param>
        /// <param name="role">Application role (Admin, Manager, ServiceAdvisor, Mechanic).</param>
        /// <param name="jwtSettings">JWT configuration from appsettings.json.</param>
        /// <returns>Signed JWT token string.</returns>
        public static string GenerateToken(
            int userId,
            string username,
            string email,
            string role,
            JwtSettings jwtSettings)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub,   userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(ClaimTypes.NameIdentifier,     userId.ToString()),
                new Claim(ClaimTypes.Name,               username),
                new Claim(ClaimTypes.Email,              email),
                new Claim(ClaimTypes.Role,               role),
                new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer:            jwtSettings.Issuer,
                audience:          jwtSettings.Audience,
                claims:            claims,
                notBefore:         DateTime.UtcNow,
                expires:           DateTime.UtcNow.AddMinutes(jwtSettings.ExpirationMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Generates a cryptographically secure 64-byte opaque refresh token.
        /// </summary>
        /// <returns>Base64-encoded refresh token string.</returns>
        public static string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
