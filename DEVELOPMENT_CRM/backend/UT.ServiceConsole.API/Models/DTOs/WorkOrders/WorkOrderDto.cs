using System;

namespace UT.ServiceConsole.API.Models.DTOs.WorkOrders
{
    /// <summary>Summary DTO for WorkOrder list views.</summary>
    public class WorkOrderDto
    {
        public int WorkOrderID { get; set; }
        public string WorkOrderNumber { get; set; } = string.Empty;
        public int CaseID { get; set; }
        public string CaseNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string? AssetName { get; set; }
        public string? AccountName { get; set; }
        public string? AssignedMechanicName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    /// <summary>Full detail DTO for WorkOrder detail page.</summary>
    public class WorkOrderDetailDto : WorkOrderDto
    {
        public string? Description { get; set; }
        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public int? AssignedMechanicID { get; set; }
        public string? WorkCenter { get; set; }
        public string? Plant { get; set; }
        public decimal? LastSMR { get; set; }
        public decimal? ActualSMR { get; set; }
        public int TSRDataScore { get; set; }
        public int TSRRootCauseScore { get; set; }
        public int TSRMonitoringScore { get; set; }
        public bool BreakdownIndicator { get; set; }
        public string? SAPWorkOrderNumber { get; set; }
    }

    /// <summary>Request payload to create a new WorkOrder.</summary>
    public class CreateWorkOrderRequest
    {
        public int CaseID { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? AssignedMechanicID { get; set; }
        public int? AssetID { get; set; }
        public int? AccountID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? WorkCenter { get; set; }
        public string? Plant { get; set; }
        public decimal? LastSMR { get; set; }
    }

    /// <summary>Request payload to update an existing WorkOrder.</summary>
    public class UpdateWorkOrderRequest
    {
        public string? Status { get; set; }
        public string? Subject { get; set; }
        public string? Description { get; set; }
        public int? AssignedMechanicID { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public decimal? ActualSMR { get; set; }
        public int? TSRDataScore { get; set; }
        public int? TSRRootCauseScore { get; set; }
        public int? TSRMonitoringScore { get; set; }
    }
}
