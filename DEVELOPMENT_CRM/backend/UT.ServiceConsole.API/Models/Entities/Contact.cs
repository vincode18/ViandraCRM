using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Contact person linked to an Account.</summary>
    [Table("Contacts")]
    public class Contact
    {
        [Key]
        public int ContactID { get; set; }

        [Required, MaxLength(200)]
        public string ContactName { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        public string? Title { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public int AccountID { get; set; }
        public bool IsPrimary { get; set; } = false;

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }

        [ForeignKey(nameof(AccountID))]
        public virtual Account Account { get; set; } = null!;
    }
}
