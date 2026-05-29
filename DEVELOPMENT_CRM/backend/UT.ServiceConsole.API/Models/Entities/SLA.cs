using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Service Level Agreement tracking record linked to a Case.</summary>
    [Table("SLA")]
    public class SLA
    {
        [Key]
        public int SLAID { get; set; }

        public int CaseID { get; set; }

        [Required, MaxLength(50)]
        public string SLAType { get; set; } = string.Empty;

        public DateTime TargetDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public bool IsBreached { get; set; } = false;
        public DateTime? BreachedDate { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(CaseID))]
        public virtual Case Case { get; set; } = null!;
    }
}
