using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.DTOs;
using UT.ServiceConsole.API.Models.DTOs.Cases;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Services.Interfaces;

namespace UT.ServiceConsole.API.Controllers
{
    /// <summary>
    /// CRUD endpoints for Cases.
    /// All endpoints require a valid JWT (Bearer token).
    /// </summary>
    [ApiController]
    [Route("api/cases")]
    [Authorize]
    [Produces("application/json")]
    public class CasesController : ControllerBase
    {
        private readonly ICaseService _caseService;
        private readonly ILogger<CasesController> _logger;

        /// <inheritdoc />
        public CasesController(ICaseService caseService, ILogger<CasesController> logger)
        {
            _caseService = caseService;
            _logger = logger;
        }

        /// <summary>Returns a paginated list of cases with optional filters.</summary>
        /// <param name="page">Page number (default 1).</param>
        /// <param name="pageSize">Items per page (default 20).</param>
        /// <param name="status">Filter by status: Open, Assigned, InProgress, Resolved, Closed.</param>
        /// <param name="priority">Filter by priority: Low, Medium, High, Critical.</param>
        /// <param name="search">Full-text search on case number, subject, and description.</param>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<CaseDto>>), 200)]
        public async Task<IActionResult> GetCases(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] string? priority = null,
            [FromQuery] string? search = null)
        {
            var result = await _caseService.GetCasesAsync(page, pageSize, status, priority, search);
            return Ok(ApiResponse<PagedResult<CaseDto>>.Ok(result));
        }

        /// <summary>Returns full detail of a single case.</summary>
        /// <param name="id">Case primary key.</param>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<CaseDetailDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetCase(int id)
        {
            var result = await _caseService.GetCaseByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<object>.Fail($"Case #{id} not found."));

            return Ok(ApiResponse<CaseDetailDto>.Ok(result));
        }

        /// <summary>Returns case detail with 3-column layout (FRD: Case Module Main Layout).</summary>
        /// <param name="id">Case primary key or case number.</param>
        [HttpGet("detail/{id}")]
        [ProducesResponseType(typeof(ApiResponse<CaseDetailLayoutDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetCaseDetail(string id)
        {
            // Try to parse as integer, otherwise treat as case number string
            if (int.TryParse(id, out int caseId))
            {
                // Use database service
                var result = await _caseService.GetCaseByIdAsync(caseId);
                if (result == null)
                    return NotFound(ApiResponse<object>.Fail($"Case #{caseId} not found."));

                // Convert to CaseDetailLayoutDto with 3-column layout data
                var detailDto = ConvertToCaseDetailDto(result);
                return Ok(ApiResponse<CaseDetailLayoutDto>.Ok(detailDto));
            }
            else
            {
                // Return dummy data for case number string (for UI demonstration)
                var dummyData = GetDummyCaseDetail(id);
                return Ok(ApiResponse<CaseDetailLayoutDto>.Ok(dummyData));
            }
        }

        /// <summary>Converts existing CaseDto to CaseDetailLayoutDto with 3-column layout data.</summary>
        private CaseDetailLayoutDto ConvertToCaseDetailDto(Models.DTOs.Cases.CaseDetailDto caseDto)
        {
            // TODO: Implement conversion from database entities to full CaseDetailLayoutDto
            // This will query related entities (assets, work orders, etc.)
            return new CaseDetailLayoutDto
            {
                CaseNumber = caseDto.CaseNumber,
                Priority = caseDto.Priority,
                Status = caseDto.Status,
                Owner = caseDto.AssignedOwnerName ?? "System User",
                StartDate = caseDto.StartDate,
                TargetDate = caseDto.TargetResolutionDate ?? caseDto.StartDate.AddDays(5),
                Subject = caseDto.Subject,
                Description = caseDto.Description ?? "No description provided",
                ProgressSteps = GetProgressSteps(caseDto.Status),
                CreatedDate = caseDto.CreatedDate,
                LastUpdatedDate = caseDto.ClosedDate,
                CreatedBy = "System",
                LastUpdatedBy = "System",
                SlaTracking = new SlaTrackingDto
                {
                    StartDateOtfMechanic = caseDto.StartDate,
                    TargetDateOtfMechanic = caseDto.StartDate.AddHours(4),
                    StartDateSla = caseDto.StartDate,
                    TargetDateSla = caseDto.TargetResolutionDate ?? caseDto.StartDate.AddDays(5),
                    BackdateValidation = new BackdateValidationDto
                    {
                        MechanicStart = caseDto.StartDate,
                        JobComplete = caseDto.ClosedDate,
                        JobCompleteValidated = caseDto.Status == "Closed",
                        BackdateReason = "Standard case processing"
                    }
                },
                // TODO: Populate with actual related data from database
                FleetUnits = new List<FleetUnitDto>(),
                AffectedUnit = new AffectedUnitDto(),
                AccountContext = new AccountContextDto(),
                WorkOrders = new List<WorkOrderSummaryDto>(),
                PartsRequests = new List<PartsRequestDto>(),
                SlaStatus = new SlaStatusDto(),
                PerformanceMetrics = new List<PerformanceMetricDto>(),
                Timeline = new List<TimelineEventDto>(),
                PastCases = new List<PastCaseDto>()
            };
        }

        /// <summary>Returns dummy data for case detail 3-column layout (FRD: Case Module Main Layout).</summary>
        private CaseDetailLayoutDto GetDummyCaseDetail(string caseNumber)
        {
            return new CaseDetailLayoutDto
            {
                // === Center Panel: Case Header ===
                CaseNumber = caseNumber,
                Priority = "Medium",
                Status = "Closed",
                Owner = "System User",
                StartDate = new DateTime(2026, 5, 26, 7, 31, 0),
                TargetDate = new DateTime(2026, 6, 2, 7, 31, 0),
                Subject = "Hydraulic Leak on Right Cylinder",
                Description = "Operator reported significant hydraulic fluid leak near the right cylinder during morning inspection. Machine grounded pending repair. Suspect blown seal or damaged hose fitting. Requires immediate inspection and replacement parts.",
                ProgressSteps = new List<string> { "Open", "Assigned", "In Progress", "Resolved", "Closed" },
                CreatedDate = new DateTime(2026, 5, 26, 7, 31, 0),
                LastUpdatedDate = new DateTime(2026, 5, 28, 16, 45, 0),
                CreatedBy = "System User",
                LastUpdatedBy = "System User",

                // === Center Panel: SLA Tracking ===
                SlaTracking = new SlaTrackingDto
                {
                    StartDateOtfMechanic = new DateTime(2026, 5, 26, 7, 31, 0),
                    TargetDateOtfMechanic = new DateTime(2026, 5, 26, 11, 31, 0),
                    StartDateSla = new DateTime(2026, 5, 26, 7, 31, 0),
                    TargetDateSla = new DateTime(2026, 6, 2, 7, 31, 0),
                    BackdateValidation = new BackdateValidationDto
                    {
                        MechanicStart = new DateTime(2026, 5, 26, 7, 31, 0),
                        JobComplete = new DateTime(2026, 5, 28, 15, 30, 0),
                        JobCompleteValidated = true,
                        BackdateReason = "Manual Backdate. Initial dispatch delayed due to site access clearance."
                    }
                },

                // === Left Panel: Fleet Units ===
                FleetUnits = new List<FleetUnitDto>
                {
                    new FleetUnitDto
                    {
                        Id = "GD-829",
                        Model = "Komatsu D85ESS-2",
                        Status = "Active",
                        Hours = 14250,
                        Location = "Site 8 - Pit 4",
                        Warnings = new List<string>()
                    },
                    new FleetUnitDto
                    {
                        Id = "GD-830",
                        Model = "PC200-8",
                        Status = "Maint. Req.",
                        Hours = 12500,
                        Location = "Site A - Loading",
                        Warnings = new List<string> { "Maintenance overdue" }
                    },
                    new FleetUnitDto
                    {
                        Id = "GD-831",
                        Model = "WA200-6",
                        Status = "Operational",
                        Hours = 16750,
                        Location = "Transportation",
                        Warnings = new List<string>()
                    },
                    new FleetUnitDto
                    {
                        Id = "GD-832",
                        Model = "D65EX-12",
                        Status = "In Repair",
                        Hours = 11200,
                        Location = "Workshop",
                        Warnings = new List<string> { "Repair in progress" }
                    }
                },

                // === Left Panel: Affected Unit ===
                AffectedUnit = new AffectedUnitDto
                {
                    AssetId = "EQ-HT-9942",
                    Model = "Komatsu D85ESS-2",
                    Location = "Site B - Pit 4",
                    SerialNumber = "D85ESS-2-2024-0153"
                },

                // === Left Panel: Account Context ===
                AccountContext = new AccountContextDto
                {
                    AccountId = 1,
                    AccountName = "PUTRA PERKASA ABADI",
                    AccountTier = "Tier 1 Enterprise",
                    PrimaryContactName = "Andi Wijaya (Manager)",
                    PrimaryContactPhone = "+62-811-111-2222",
                    PrimaryContactEmail = "andi@putraabadi.co.id",
                    PrimaryContactRole = "Manager"
                },

                // === Left Panel: Work Orders ===
                WorkOrders = new List<WorkOrderSummaryDto>
                {
                    new WorkOrderSummaryDto
                    {
                        WoNumber = "WO-88392",
                        WorkOrderId = 1,
                        Status = "In Progress",
                        Description = "Replace hydraulic cylinder seals",
                        Technician = "Budi Santoso",
                        DueDate = new DateTime(2026, 5, 30, 17, 0, 0),
                        ProgressPercentage = 65
                    }
                },

                // === Left Panel: Parts Requests ===
                PartsRequests = new List<PartsRequestDto>
                {
                    new PartsRequestDto
                    {
                        PartId = "PRT-992-B",
                        Description = "Seal Kit - High Temp",
                        QuantityRequested = 2,
                        Status = "Delivered",
                        RequestedDate = new DateTime(2026, 5, 26, 10, 0, 0)
                    }
                },

                // === Right Panel: SLA Status ===
                SlaStatus = new SlaStatusDto
                {
                    Status = "breached",
                    DaysOverdue = 17,
                    OtfMechanicStatus = "failed",
                    OtfMechanicDays = 6.0,
                    OtfSolutionStatus = "pending",
                    ComplianceScore = 0,
                    BreachAcknowledged = false
                },

                // === Right Panel: Performance Metrics ===
                PerformanceMetrics = new List<PerformanceMetricDto>
                {
                    new PerformanceMetricDto
                    {
                        Name = "1st Response",
                        Target = "4h",
                        Actual = "0.5h",
                        Met = true
                    },
                    new PerformanceMetricDto
                    {
                        Name = "Resolution",
                        Target = "5d",
                        Actual = "153d",
                        Met = false
                    }
                },

                // === Right Panel: Timeline ===
                Timeline = new List<TimelineEventDto>
                {
                    new TimelineEventDto
                    {
                        Date = new DateTime(2026, 10, 26),
                        Time = "14:30",
                        EventType = "CASE_CLOSED",
                        Title = "CASE CLOSED",
                        Description = "System User - SLA review completed.",
                        User = "System User"
                    },
                    new TimelineEventDto
                    {
                        Date = new DateTime(2026, 5, 28),
                        Time = "16:45",
                        EventType = "COMPLETION_NOTE",
                        Title = "COMPLETION NOTE",
                        Description = "\"All repairs completed. System tested and verified.\"",
                        User = "Budi Santoso"
                    },
                    new TimelineEventDto
                    {
                        Date = new DateTime(2026, 5, 27),
                        Time = "09:00",
                        EventType = "PARTS_ARRIVED",
                        Title = "PARTS ARRIVED",
                        Description = "Warehouse - Items verified and issued to technician.",
                        User = "System"
                    },
                    new TimelineEventDto
                    {
                        Date = new DateTime(2026, 5, 26),
                        Time = "07:31",
                        EventType = "CASE_CREATED",
                        Title = "CASE CREATED",
                        Description = "System User - Automated case creation from inspection.",
                        User = "System User"
                    }
                },

                // === Right Panel: Past Cases ===
                PastCases = new List<PastCaseDto>
                {
                    new PastCaseDto
                    {
                        CaseNumber = "01555475",
                        CaseId = 2,
                        Subject = "Hydraulic Leak",
                        AssetReference = "HO785:7-BO76",
                        Status = "IN PROGRESS"
                    },
                    new PastCaseDto
                    {
                        CaseNumber = "01473917",
                        CaseId = 3,
                        Subject = "Engine Overheat",
                        AssetReference = "GD-830",
                        Status = "CLOSED"
                    }
                }
            };
        }

        private List<string> GetProgressSteps(string status)
        {
            var steps = new List<string> { "Open", "Assigned", "In Progress", "Resolved", "Closed" };
            // Return all steps (frontend will determine which are completed based on status)
            return steps;
        }

        /// <summary>Creates a new case. Assigns auto-generated case number.</summary>
        /// <param name="request">Case creation payload.</param>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<CaseDetailDto>), 201)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        public async Task<IActionResult> CreateCase([FromBody] CreateCaseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail("Validation failed.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));

            var userId = GetCurrentUserId();
            var result = await _caseService.CreateCaseAsync(request, userId);
            return CreatedAtAction(nameof(GetCase), new { id = result.CaseID },
                ApiResponse<CaseDetailDto>.Ok(result, "Case created successfully."));
        }

        /// <summary>Updates an existing case's fields.</summary>
        /// <param name="id">Case primary key.</param>
        /// <param name="request">Fields to update (null fields are ignored).</param>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<CaseDetailDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateCase(int id, [FromBody] UpdateCaseRequest request)
        {
            var userId = GetCurrentUserId();
            var result = await _caseService.UpdateCaseAsync(id, request, userId);
            if (result == null)
                return NotFound(ApiResponse<object>.Fail($"Case #{id} not found."));

            return Ok(ApiResponse<CaseDetailDto>.Ok(result, "Case updated successfully."));
        }

        /// <summary>Permanently deletes a case (Admin role required).</summary>
        /// <param name="id">Case primary key.</param>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteCase(int id)
        {
            var success = await _caseService.DeleteCaseAsync(id);
            if (!success)
                return NotFound(ApiResponse<object>.Fail($"Case #{id} not found."));

            return Ok(ApiResponse<object>.Ok(null, "Case deleted."));
        }

        private int GetCurrentUserId()
        {
            int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int id);
            return id;
        }
    }
}
