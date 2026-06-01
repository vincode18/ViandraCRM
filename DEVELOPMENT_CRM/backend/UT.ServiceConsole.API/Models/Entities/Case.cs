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

        [MaxLength(100)]
        public string? Category { get; set; }

        [MaxLength(100)]
        public string? SubCategory { get; set; }

        // Section 1: Case Information (additional fields)
        [MaxLength(100)]
        public string? Plant { get; set; }

        [MaxLength(100)]
        public string? ServiceArea { get; set; }

        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public int? ContactID { get; set; }
        public int? AssignedOwnerID { get; set; }

        // Section 2: Case Informant
        [MaxLength(200)]
        public string? InformantName { get; set; }

        [MaxLength(150)]
        public string? InformantEmail { get; set; }

        [MaxLength(50)]
        public string? InformantPosition { get; set; } // ASC, Sales, BC

        // Section 3: Case Details (additional fields)
        [MaxLength(50)]
        public string? ParentCaseID { get; set; }

        [MaxLength(50)]
        public string? Direction { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(50)]
        public string? CaseOrigin { get; set; }

        [MaxLength(100)]
        public string? SmrProblem { get; set; }

        public DateTime? DateTimeOpened { get; set; }

        [MaxLength(100)]
        public string? ObjectPart { get; set; }

        [MaxLength(100)]
        public string? SpecificObjectPart { get; set; }

        [MaxLength(100)]
        public string? Cause { get; set; }

        [MaxLength(50)]
        public string? CallType { get; set; }

        [MaxLength(100)]
        public string? Damage { get; set; }

        [MaxLength(100)]
        public string? SubcallType { get; set; }

        public string? DescriptionUpdate { get; set; }

        [MaxLength(50)]
        public string? SapStatus { get; set; }

        [MaxLength(50)]
        public string? CsRating { get; set; }

        [MaxLength(100)]
        public string? CloseReason { get; set; }

        [MaxLength(50)]
        public string? Emr { get; set; }

        public string? WaUpdateProgress { get; set; }

        public DateTime? TroubleDate { get; set; }

        public string? WaClosingUpdate { get; set; }

        [MaxLength(50)]
        public string? WaNumber { get; set; }

        public string? WaDescription { get; set; }

        // Section 4: Completion OTIF
        public DateTime? OtifMechStart { get; set; }
        public DateTime? OtifMechTarget { get; set; }
        public DateTime? OtifSolStart { get; set; }
        public DateTime? OtifSolTarget { get; set; }

        // Section 5: Backdate
        public DateTime? BackdateMech { get; set; }
        public DateTime? BackdateSol { get; set; }

        [MaxLength(100)]
        public string? ReasonBackdate { get; set; }

        public string? ReasonOthers { get; set; }

        // Section 6: OTIF Status
        [MaxLength(50)]
        public string? OtifMechStatus { get; set; }

        public bool NotOtifMech { get; set; } = false;

        [MaxLength(100)]
        public string? NotOtifMechReason { get; set; }

        [MaxLength(100)]
        public string? OmCompensation { get; set; }

        [MaxLength(50)]
        public string? OtifSolStatus { get; set; }

        public bool NotOtifSol { get; set; } = false;

        [MaxLength(100)]
        public string? NotOtifSolReason { get; set; }

        // Section 7: Billing
        [MaxLength(100)]
        public string? BillingAccount { get; set; }

        [MaxLength(100)]
        public string? BillingSalesOffice { get; set; }

        [MaxLength(100)]
        public string? BillingDivision { get; set; }

        [MaxLength(50)]
        public string? BillingSalesOfficeCode { get; set; }

        [MaxLength(200)]
        public string? BillingContactName { get; set; }

        // Section 8: Additional Info
        public DateTime? DtAssigned { get; set; }

        [MaxLength(50)]
        public string? ApprovalStatus { get; set; }

        public DateTime? DtInProgress { get; set; }

        public bool NeedManPower { get; set; } = false;

        public DateTime? DtResolved { get; set; }

        public bool CaseCancel { get; set; } = false;

        public DateTime? DtSupervisorApprove { get; set; }

        // Section 9: System (milestone tracking)
        [MaxLength(50)]
        public string MilestoneStatus { get; set; } = "Open";

        // Existing fields
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? TargetResolutionDate { get; set; }
        public DateTime? SlaResponseTarget { get; set; }
        public DateTime? SlaResolutionTarget { get; set; }

        [MaxLength(20)]
        public string SlaStatus { get; set; } = "OnTrack";

        public DateTime? ClosedDate { get; set; }
        public string? CompletionNote { get; set; }

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
