using System;

namespace UT.ServiceConsole.API.DTOs
{
    /// <summary>
    /// DTO for Case Detail View - 3-Column Layout
    /// Based on FRD: 1.1 FRD Case Module Main Layout
    /// </summary>
    public class CaseDetailLayoutDto
    {
        // === Center Panel: Case Header ===
        public string CaseNumber { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Owner { get; set; } = string.Empty;
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime TargetDate { get; set; } = DateTime.Now;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> ProgressSteps { get; set; } = new List<string>();
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? LastUpdatedDate { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string LastUpdatedBy { get; set; } = string.Empty;

        // === Center Panel: SLA Tracking ===
        public SlaTrackingDto SlaTracking { get; set; } = new SlaTrackingDto();

        // === Left Panel: Related Data ===
        public List<FleetUnitDto> FleetUnits { get; set; } = new List<FleetUnitDto>();
        public AffectedUnitDto AffectedUnit { get; set; } = new AffectedUnitDto();
        public AccountContextDto AccountContext { get; set; } = new AccountContextDto();
        public List<WorkOrderSummaryDto> WorkOrders { get; set; } = new List<WorkOrderSummaryDto>();
        public List<PartsRequestDto> PartsRequests { get; set; } = new List<PartsRequestDto>();

        // === Right Panel: SLA & Performance ===
        public SlaStatusDto SlaStatus { get; set; } = new SlaStatusDto();
        public List<PerformanceMetricDto> PerformanceMetrics { get; set; } = new List<PerformanceMetricDto>();
        public List<TimelineEventDto> Timeline { get; set; } = new List<TimelineEventDto>();
        public List<PastCaseDto> PastCases { get; set; } = new List<PastCaseDto>();
    }

    public class SlaTrackingDto
    {
        public DateTime StartDateOtfMechanic { get; set; } = DateTime.Now;
        public DateTime TargetDateOtfMechanic { get; set; } = DateTime.Now;
        public DateTime StartDateSla { get; set; } = DateTime.Now;
        public DateTime TargetDateSla { get; set; } = DateTime.Now;
        public BackdateValidationDto BackdateValidation { get; set; } = new BackdateValidationDto();
    }

    public class BackdateValidationDto
    {
        public DateTime MechanicStart { get; set; } = DateTime.Now;
        public DateTime? JobComplete { get; set; }
        public bool JobCompleteValidated { get; set; }
        public string BackdateReason { get; set; } = string.Empty;
    }

    // === Left Panel DTOs ===
    public class FleetUnitDto
    {
        public string Id { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public long Hours { get; set; }
        public string Location { get; set; } = string.Empty;
        public List<string> Warnings { get; set; } = new List<string>();
    }

    public class AffectedUnitDto
    {
        public string AssetId { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
    }

    public class AccountContextDto
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountTier { get; set; } = string.Empty;
        public string PrimaryContactName { get; set; } = string.Empty;
        public string PrimaryContactPhone { get; set; } = string.Empty;
        public string PrimaryContactEmail { get; set; } = string.Empty;
        public string PrimaryContactRole { get; set; } = string.Empty;
    }

    public class WorkOrderSummaryDto
    {
        public string WoNumber { get; set; } = string.Empty;
        public int WorkOrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Technician { get; set; } = string.Empty;
        public DateTime DueDate { get; set; } = DateTime.Now;
        public int? ProgressPercentage { get; set; }
    }

    public class PartsRequestDto
    {
        public string PartId { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int QuantityRequested { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedDate { get; set; } = DateTime.Now;
    }

    // === Right Panel DTOs ===
    public class SlaStatusDto
    {
        public string Status { get; set; } = "pending"; // "breached", "on_track", "at_risk", "pending"
        public int DaysOverdue { get; set; }
        public string OtfMechanicStatus { get; set; } = "pending"; // "failed", "passed", "pending"
        public double OtfMechanicDays { get; set; }
        public string OtfSolutionStatus { get; set; } = "pending"; // "pending", "passed", "failed"
        public int ComplianceScore { get; set; }
        public bool BreachAcknowledged { get; set; }
    }

    public class PerformanceMetricDto
    {
        public string Name { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Actual { get; set; } = string.Empty;
        public bool Met { get; set; }
    }

    public class TimelineEventDto
    {
        public DateTime Date { get; set; } = DateTime.Now;
        public string Time { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty; // "CASE_CREATED", "STATUS_CHANGED", "COMPLETION_NOTE", "PARTS_ARRIVED", "SLA_EVENT"
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string User { get; set; } = string.Empty;
    }

    public class PastCaseDto
    {
        public string CaseNumber { get; set; } = string.Empty;
        public int CaseId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string AssetReference { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
