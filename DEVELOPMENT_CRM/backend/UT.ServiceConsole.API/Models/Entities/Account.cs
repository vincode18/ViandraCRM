using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Customer account / company record.</summary>
    [Table("Accounts")]
    public class Account
    {
        [Key]
        public int AccountID { get; set; }

        [Required, MaxLength(200)]
        public string AccountName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? CustomerSupportType { get; set; }

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(255)]
        public string? Website { get; set; }

        [MaxLength(100)]
        public string? Industry { get; set; }

        public string? Address { get; set; }

        [MaxLength(100)]
        public string? City { get; set; }

        [MaxLength(100)]
        public string? State { get; set; }

        [MaxLength(20)]
        public string? PostalCode { get; set; }

        [MaxLength(100)]
        public string? Country { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }

        public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
        public virtual ICollection<Asset> Assets { get; set; } = new List<Asset>();
        public virtual ICollection<Case> Cases { get; set; } = new List<Case>();
    }
}
