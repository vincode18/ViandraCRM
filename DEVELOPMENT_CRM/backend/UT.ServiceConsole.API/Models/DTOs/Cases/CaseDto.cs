using System;

namespace UT.ServiceConsole.API.Models.DTOs.Cases
{
    /// <summary>Summary DTO for Case list views.</summary>
    public class CaseDto
    {
        public int CaseID { get; set; }
        public string CaseNumber { get; set; } = string.Empty;
        public string CaseType { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string? AssetName { get; set; }
        public string? AccountName { get; set; }
        public string? AssignedOwnerName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? TargetResolutionDate { get; set; }
        public bool SLABreached { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    /// <summary>Full detail DTO for Case detail page (FRD 1.4.1 - 9 sections).</summary>
    public class CaseDetailDto : CaseDto
    {
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? SubCategory { get; set; }

        // Section 1: Case Information
        public string? Plant { get; set; }
        public string? ServiceArea { get; set; }
        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public string? AccountName { get; set; }
        public int? ContactID { get; set; }
        public string? ContactName { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactTitle { get; set; }
        public int? AssignedOwnerID { get; set; }
        public string? AssignedOwnerName { get; set; }

        // Section 2: Case Informant
        public string? InformantName { get; set; }
        public string? InformantEmail { get; set; }
        public string? InformantPosition { get; set; }

        // Section 3: Case Details (additional)
        public string? ParentCaseID { get; set; }
        public string? Direction { get; set; }
        public string? Location { get; set; }
        public string? CaseOrigin { get; set; }
        public string? SmrProblem { get; set; }
        public DateTime? DateTimeOpened { get; set; }
        public string? ObjectPart { get; set; }
        public string? SpecificObjectPart { get; set; }
        public string? Cause { get; set; }
        public string? CallType { get; set; }
        public string? Damage { get; set; }
        public string? SubcallType { get; set; }
        public string? DescriptionUpdate { get; set; }
        public string? SapStatus { get; set; }
        public string? CsRating { get; set; }
        public string? CloseReason { get; set; }
        public string? Emr { get; set; }
        public string? WaUpdateProgress { get; set; }
        public DateTime? TroubleDate { get; set; }
        public string? WaClosingUpdate { get; set; }
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
        public string? ReasonBackdate { get; set; }
        public string? ReasonOthers { get; set; }

        // Section 6: OTIF Status
        public string? OtifMechStatus { get; set; }
        public bool NotOtifMech { get; set; }
        public string? NotOtifMechReason { get; set; }
        public string? OmCompensation { get; set; }
        public string? OtifSolStatus { get; set; }
        public bool NotOtifSol { get; set; }
        public string? NotOtifSolReason { get; set; }

        // Section 7: Billing
        public string? BillingAccount { get; set; }
        public string? BillingSalesOffice { get; set; }
        public string? BillingDivision { get; set; }
        public string? BillingSalesOfficeCode { get; set; }
        public string? BillingContactName { get; set; }

        // Section 8: Additional Info
        public DateTime? DtAssigned { get; set; }
        public string? ApprovalStatus { get; set; }
        public DateTime? DtInProgress { get; set; }
        public bool NeedManPower { get; set; }
        public DateTime? DtResolved { get; set; }
        public bool CaseCancel { get; set; }
        public DateTime? DtSupervisorApprove { get; set; }

        // Section 9: System
        public string MilestoneStatus { get; set; } = "Open";

        // Existing fields
        public DateTime? ClosedDate { get; set; }
        public string? CompletionNote { get; set; }
        public decimal? ComplianceScore { get; set; }
        public DateTime? SlaResponseTarget { get; set; }
        public DateTime? SlaResolutionTarget { get; set; }
        public string SlaStatus { get; set; } = "OnTrack";
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public int CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }
    }

    /// <summary>Request payload to create a new Case (FRD 1.4.1 - 9 sections).</summary>
    public class CreateCaseRequest
    {
        public string CaseType { get; set; } = "Request";
        public string Priority { get; set; } = "Medium";
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? SubCategory { get; set; }

        // Section 1: Case Information
        public string? Plant { get; set; }
        public string? ServiceArea { get; set; }
        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public int? ContactID { get; set; }
        public int? AssignedOwnerID { get; set; }

        // Section 2: Case Informant
        public string? InformantName { get; set; }
        public string? InformantEmail { get; set; }
        public string? InformantPosition { get; set; }

        // Section 3: Case Details (additional)
        public string? ParentCaseID { get; set; }
        public string? Direction { get; set; }
        public string? Location { get; set; }
        public string? CaseOrigin { get; set; }
        public string? SmrProblem { get; set; }
        public DateTime? DateTimeOpened { get; set; }
        public string? ObjectPart { get; set; }
        public string? SpecificObjectPart { get; set; }
        public string? Cause { get; set; }
        public string? CallType { get; set; }
        public string? Damage { get; set; }
        public string? SubcallType { get; set; }
        public string? DescriptionUpdate { get; set; }
        public string? SapStatus { get; set; }
        public string? CsRating { get; set; }
        public string? CloseReason { get; set; }
        public string? Emr { get; set; }
        public string? WaUpdateProgress { get; set; }
        public DateTime? TroubleDate { get; set; }
        public string? WaClosingUpdate { get; set; }
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
        public string? ReasonBackdate { get; set; }
        public string? ReasonOthers { get; set; }

        // Section 6: OTIF Status
        public string? OtifMechStatus { get; set; }
        public bool NotOtifMech { get; set; }
        public string? NotOtifMechReason { get; set; }
        public string? OmCompensation { get; set; }
        public string? OtifSolStatus { get; set; }
        public bool NotOtifSol { get; set; }
        public string? NotOtifSolReason { get; set; }

        // Section 7: Billing
        public string? BillingAccount { get; set; }
        public string? BillingSalesOffice { get; set; }
        public string? BillingDivision { get; set; }
        public string? BillingSalesOfficeCode { get; set; }
        public string? BillingContactName { get; set; }

        // Section 8: Additional Info
        public DateTime? DtAssigned { get; set; }
        public string? ApprovalStatus { get; set; }
        public DateTime? DtInProgress { get; set; }
        public bool NeedManPower { get; set; }
        public DateTime? DtResolved { get; set; }
        public bool CaseCancel { get; set; }
        public DateTime? DtSupervisorApprove { get; set; }

        // Existing fields
        public DateTime? TargetResolutionDate { get; set; }
    }

    /// <summary>Request payload to update an existing Case.</summary>
    public class UpdateCaseRequest
    {
        public string? Priority { get; set; }
        public string? Status { get; set; }
        public string? Subject { get; set; }
        public string? Description { get; set; }
        public int? AssignedOwnerID { get; set; }
        public DateTime? TargetResolutionDate { get; set; }
        public DateTime? ClosedDate { get; set; }
    }
}
