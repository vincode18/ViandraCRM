using System.ComponentModel.DataAnnotations;

namespace UT.ServiceConsole.API.Models.DTOs.Auth
{
    /// <summary>Request payload for POST /api/auth/register.</summary>
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        [MaxLength(50)]
        public string Role { get; set; } = "ServiceAdvisor";

        [MaxLength(100)]
        public string? Department { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
    }
}
