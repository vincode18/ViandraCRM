using System.Threading.Tasks;
using UT.ServiceConsole.API.Models.DTOs.Auth;

namespace UT.ServiceConsole.API.Services.Interfaces
{
    /// <summary>Contract for the authentication and session management service.</summary>
    public interface IAuthService
    {
        /// <summary>Validates credentials and returns a JWT token on success.</summary>
        Task<LoginResponse> LoginAsync(LoginRequest request, string? ipAddress, string? userAgent);

        /// <summary>Records logout event (token revocation handled client-side for MVP).</summary>
        Task<bool> LogoutAsync(int userId);

        /// <summary>Sends a password reset link to the given email address.</summary>
        Task<bool> ForgotPasswordAsync(string email);

        /// <summary>Resets password with a valid reset token.</summary>
        Task<bool> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
