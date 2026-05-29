using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Work order linked to a case; assigned to a mechanic for execution.</summary>
    [Table("WorkOrders")]
    public class WorkOrder
    {
        [Key]
        public int WorkOrderID { get; set; }

        [Required, MaxLength(50)]
        public string WorkOrderNumber { get; set; } = string.Empty;

        public int CaseID { get; set; }

        [Required, MaxLength(50)]
        public string Status { get; set; } = "New";

        public int OwnerID { get; set; }
        public int? AssignedMechanicID { get; set; }
        public int? AccountID { get; set; }
        public int? ContactID { get; set; }
        public int? AssetID { get; set; }

        [Required, MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }

        [MaxLength(100)]
        public string? WorkCenter { get; set; }

        [MaxLength(50)]
        public string? Plant { get; set; }

        [MaxLength(100)]
        public string? CostCenter { get; set; }

        [MaxLength(200)]
        public string? ObjectPart { get; set; }

        [MaxLength(200)]
        public string? SpecificObjectPart { get; set; }

        public DateTime? MalfunctionStartDate { get; set; }
        public DateTime? MalfunctionEndDate { get; set; }
        public bool BreakdownIndicator { get; set; } = false;

        [Column(TypeName = "decimal(10,2)")]
        public decimal? LastSMR { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ActualSMR { get; set; }

        public int TSRDataScore { get; set; } = 0;
        public int TSRRootCauseScore { get; set; } = 0;
        public int TSRMonitoringScore { get; set; } = 0;

        public DateTime? ABRFileDate { get; set; }

        [MaxLength(50)]
        public string? SAPWorkOrderNumber { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }

        [ForeignKey(nameof(CaseID))]
        public virtual Case Case { get; set; } = null!;

        [ForeignKey(nameof(OwnerID))]
        public virtual User Owner { get; set; } = null!;

        [ForeignKey(nameof(AssignedMechanicID))]
        public virtual User? AssignedMechanic { get; set; }

        [ForeignKey(nameof(AccountID))]
        public virtual Account? Account { get; set; }

        [ForeignKey(nameof(AssetID))]
        public virtual Asset? Asset { get; set; }

        public virtual ICollection<WorkOrderNote> Notes { get; set; } = new List<WorkOrderNote>();
    }
}
