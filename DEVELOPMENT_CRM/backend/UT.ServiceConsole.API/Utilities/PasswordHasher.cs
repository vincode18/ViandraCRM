using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace UT.ServiceConsole.API.Utilities
{
    /// <summary>
    /// Provides SHA-256 password hashing with a per-password salt and
    /// password-strength validation following security best practices.
    /// Passwords are NEVER logged or returned in any response.
    /// </summary>
    public static class PasswordHasher
    {
        private const int SaltSize = 16; // 128-bit salt

        /// <summary>
        /// Hashes a plain-text password using SHA-256 with a random salt.
        /// Format stored: base64(salt):base64(hash)
        /// </summary>
        /// <param name="password">Plain-text password – never stored.</param>
        /// <returns>Salted hash string safe for database storage.</returns>
        public static string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException(nameof(password));

            // Generate random salt
            byte[] saltBytes = new byte[SaltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }

            byte[] hashBytes = ComputeHash(password, saltBytes);

            return $"{Convert.ToBase64String(saltBytes)}:{Convert.ToBase64String(hashBytes)}";
        }

        /// <summary>
        /// Verifies a plain-text password against a stored salted hash.
        /// </summary>
        /// <param name="password">Plain-text password to verify.</param>
        /// <param name="storedHash">Hash previously produced by <see cref="HashPassword"/>.</param>
        /// <returns><c>true</c> if password matches; otherwise <c>false</c>.</returns>
        public static bool VerifyPassword(string password, string storedHash)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(storedHash))
                return false;

            var parts = storedHash.Split(':');
            if (parts.Length != 2)
                return false;

            try
            {
                byte[] saltBytes = Convert.FromBase64String(parts[0]);
                byte[] expectedHashBytes = Convert.FromBase64String(parts[1]);
                byte[] actualHashBytes = ComputeHash(password, saltBytes);
                return CryptographicEquals(actualHashBytes, expectedHashBytes);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Validates password strength: min 8 chars, uppercase, digit, special character.
        /// </summary>
        /// <param name="password">Password to validate.</param>
        /// <returns>Tuple of (isValid, errorMessage).</returns>
        public static (bool IsValid, string Message) ValidateStrength(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return (false, "Password cannot be empty.");

            if (password.Length < 8)
                return (false, "Password must be at least 8 characters.");

            if (!Regex.IsMatch(password, @"[A-Z]"))
                return (false, "Password must contain at least one uppercase letter.");

            if (!Regex.IsMatch(password, @"[0-9]"))
                return (false, "Password must contain at least one number.");

            if (!Regex.IsMatch(password, @"[@#$%!&*()_\-+=\[\]{}|;:',.<>?/\\`~^]"))
                return (false, "Password must contain at least one special character.");

            return (true, "Password is valid.");
        }

        // ─────────────────────────────── private ─────────────────────────────

        private static byte[] ComputeHash(string password, byte[] salt)
        {
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] combined = new byte[salt.Length + passwordBytes.Length];
            Buffer.BlockCopy(salt, 0, combined, 0, salt.Length);
            Buffer.BlockCopy(passwordBytes, 0, combined, salt.Length, passwordBytes.Length);

            using var sha256 = SHA256.Create();
            return sha256.ComputeHash(combined);
        }

        /// <summary>Constant-time comparison to prevent timing attacks.</summary>
        private static bool CryptographicEquals(byte[] a, byte[] b)
        {
            if (a.Length != b.Length) return false;
            int diff = 0;
            for (int i = 0; i < a.Length; i++)
                diff |= a[i] ^ b[i];
            return diff == 0;
        }
    }
}
