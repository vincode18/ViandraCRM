namespace UT.ServiceConsole.API.Configurations
{
    /// <summary>JWT configuration bound from appsettings.json → JwtSettings section.</summary>
    public class JwtSettings
    {
        /// <summary>HMAC signing secret – must be at least 32 characters.</summary>
        public string SecretKey { get; set; } = string.Empty;

        /// <summary>Token issuer (iss claim).</summary>
        public string Issuer { get; set; } = string.Empty;

        /// <summary>Token audience (aud claim).</summary>
        public string Audience { get; set; } = string.Empty;

        /// <summary>Access token lifetime in minutes. Default 480 = 8 hours.</summary>
        public int ExpirationMinutes { get; set; } = 480;

        /// <summary>Refresh token lifetime in days.</summary>
        public int RefreshTokenExpirationDays { get; set; } = 30;
    }
}
