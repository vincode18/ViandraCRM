using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Service case / ticket record.</summary>
    [Table("Cases")]
    public class Case
    {
        [Key]
        public int CaseID { get; set; }

        [Required, MaxLength(50)]
        public string CaseNumber { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string CaseType { get; set; } = "Request";

        [Required, MaxLength(20)]
        public string Priority { get; set; } = "Medium";

        [Required, MaxLength(50)]
        public string Status { get; set; } = "Open";

        [Required, MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public int? ContactID { get; set; }
        public int? AssignedOwnerID { get; set; }

        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? TargetResolutionDate { get; set; }
        public DateTime? ClosedDate { get; set; }

        public bool SLABreached { get; set; } = false;

        [Column(TypeName = "decimal(5,2)")]
        public decimal? ComplianceScore { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }

        [ForeignKey(nameof(AssetID))]
        public virtual Asset? Asset { get; set; }

        [ForeignKey(nameof(AccountID))]
        public virtual Account? Account { get; set; }

        [ForeignKey(nameof(ContactID))]
        public virtual Contact? Contact { get; set; }

        [ForeignKey(nameof(AssignedOwnerID))]
        public virtual User? AssignedOwner { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public virtual User? CreatedByUser { get; set; }

        public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
        public virtual ICollection<CaseNote> Notes { get; set; } = new List<CaseNote>();
        public virtual ICollection<SLA> SLAs { get; set; } = new List<SLA>();
    }
}
