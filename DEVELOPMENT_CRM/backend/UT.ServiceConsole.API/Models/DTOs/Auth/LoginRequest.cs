using System.ComponentModel.DataAnnotations;

namespace UT.ServiceConsole.API.Models.DTOs.Auth
{
    /// <summary>Request payload for POST /api/auth/login.</summary>
    public class LoginRequest
    {
        /// <summary>Email address or username of the user.</summary>
        [Required(ErrorMessage = "Email is required")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        /// <summary>Plain-text password (never stored/logged).</summary>
        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; } = string.Empty;

        /// <summary>When true, extends session duration.</summary>
        public bool RememberMe { get; set; } = false;
    }
}
