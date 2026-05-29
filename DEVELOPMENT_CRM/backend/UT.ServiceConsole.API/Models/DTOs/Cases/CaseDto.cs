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

    /// <summary>Full detail DTO for Case detail page.</summary>
    public class CaseDetailDto : CaseDto
    {
        public string? Description { get; set; }
        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public int? ContactID { get; set; }
        public string? ContactName { get; set; }
        public int? AssignedOwnerID { get; set; }
        public DateTime? ClosedDate { get; set; }
        public decimal? ComplianceScore { get; set; }
    }

    /// <summary>Request payload to create a new Case.</summary>
    public class CreateCaseRequest
    {
        public string CaseType { get; set; } = "Request";
        public string Priority { get; set; } = "Medium";
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public int? ContactID { get; set; }
        public int? AssignedOwnerID { get; set; }
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
