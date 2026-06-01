namespace UT.ServiceConsole.API.Models.DTOs.Auth
{
    /// <summary>Response payload for POST /api/auth/register.</summary>
    public class RegisterResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public UserDto? User { get; set; }
    }
}
