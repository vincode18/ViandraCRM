using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Immutable audit trail for all entity changes.</summary>
    [Table("AuditLog")]
    public class AuditLog
    {
        [Key]
        public int LogID { get; set; }

        [Required, MaxLength(100)]
        public string EntityName { get; set; } = string.Empty;

        public int EntityID { get; set; }

        [Required, MaxLength(50)]
        public string ActionType { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? FieldName { get; set; }

        public string? OldValue { get; set; }
        public string? NewValue { get; set; }

        public int ChangedBy { get; set; }
        public DateTime ChangedDate { get; set; } = DateTime.UtcNow;

        [MaxLength(45)]
        public string? IPAddress { get; set; }

        [MaxLength(500)]
        public string? UserAgent { get; set; }

        [ForeignKey(nameof(ChangedBy))]
        public virtual User ChangedByUser { get; set; } = null!;
    }
}
