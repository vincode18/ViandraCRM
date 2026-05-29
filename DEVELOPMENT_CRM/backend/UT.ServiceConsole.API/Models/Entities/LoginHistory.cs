using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Login/logout audit history per user.</summary>
    [Table("LoginHistory")]
    public class LoginHistory
    {
        [Key]
        public int LoginID { get; set; }

        public int UserID { get; set; }
        public DateTime LoginDate { get; set; } = DateTime.UtcNow;
        public DateTime? LogoutDate { get; set; }

        [MaxLength(45)]
        public string? IPAddress { get; set; }

        [MaxLength(500)]
        public string? UserAgent { get; set; }

        public bool Success { get; set; } = true;

        [MaxLength(255)]
        public string? FailureReason { get; set; }

        [ForeignKey(nameof(UserID))]
        public virtual User User { get; set; } = null!;
    }
}
