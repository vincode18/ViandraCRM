using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Models.DTOs.WorkOrders;
using UT.ServiceConsole.API.Models.Entities;
using UT.ServiceConsole.API.Services.Interfaces;

namespace UT.ServiceConsole.API.Services
{
    /// <summary>
    /// Business logic for Work Order CRUD, WO number generation, and status transitions.
    /// </summary>
    public class WorkOrderService : IWorkOrderService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<WorkOrderService> _logger;

        /// <inheritdoc />
        public WorkOrderService(ApplicationDbContext db, ILogger<WorkOrderService> logger)
        {
            _db = db;
            _logger = logger;
        }

        /// <summary>Returns a paginated, filterable list of work orders.</summary>
        public async Task<PagedResult<WorkOrderDto>> GetWorkOrdersAsync(
            int page, int pageSize, string? status, string? search)
        {
            var query = _db.WorkOrders
                .Include(w => w.Case)
                .Include(w => w.Asset)
                .Include(w => w.Account)
                .Include(w => w.AssignedMechanic)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(w => w.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(w =>
                    w.WorkOrderNumber.Contains(search) ||
                    w.Subject.Contains(search) ||
                    (w.Description != null && w.Description.Contains(search)));

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(w => w.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(w => MapToDto(w))
                .ToListAsync();

            return new PagedResult<WorkOrderDto>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            };
        }

        /// <summary>Returns all work orders belonging to a specific case.</summary>
        public async Task<PagedResult<WorkOrderDto>> GetWorkOrdersByCaseAsync(int caseId)
        {
            var items = await _db.WorkOrders
                .Include(w => w.Case)
                .Include(w => w.Asset)
                .Include(w => w.Account)
                .Include(w => w.AssignedMechanic)
                .Where(w => w.CaseID == caseId)
                .OrderByDescending(w => w.CreatedDate)
                .Select(w => MapToDto(w))
                .ToListAsync();

            return new PagedResult<WorkOrderDto>
            {
                Items = items,
                TotalCount = items.Count,
                Page = 1,
                PageSize = items.Count
            };
        }

        /// <summary>Returns full work order details including related entities.</summary>
        public async Task<WorkOrderDetailDto?> GetWorkOrderByIdAsync(int workOrderId)
        {
            var w = await _db.WorkOrders
                .Include(x => x.Case)
                .Include(x => x.Asset)
                .Include(x => x.Account)
                .Include(x => x.AssignedMechanic)
                .Include(x => x.Owner)
                .FirstOrDefaultAsync(x => x.WorkOrderID == workOrderId);

            return w == null ? null : MapToDetailDto(w);
        }

        /// <summary>Creates a new work order linked to an existing case.</summary>
        public async Task<WorkOrderDetailDto> CreateWorkOrderAsync(CreateWorkOrderRequest request, int createdByUserId)
        {
            var woNumber = await GenerateWorkOrderNumberAsync();

            var wo = new WorkOrder
            {
                WorkOrderNumber = woNumber,
                CaseID = request.CaseID,
                Status = "New",
                OwnerID = createdByUserId,
                AssignedMechanicID = request.AssignedMechanicID,
                AssetID = request.AssetID,
                AccountID = request.AccountID,
                Subject = request.Subject,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                WorkCenter = request.WorkCenter,
                Plant = request.Plant,
                LastSMR = request.LastSMR,
                CreatedDate = DateTime.UtcNow,
                LastModifiedDate = DateTime.UtcNow,
                CreatedBy = createdByUserId
            };

            _db.WorkOrders.Add(wo);
            await _db.SaveChangesAsync();

            _logger.LogInformation("WorkOrder created. WO_ID={WoId} Number={WoNumber}", wo.WorkOrderID, woNumber);

            return (await GetWorkOrderByIdAsync(wo.WorkOrderID))!;
        }

        /// <summary>Updates mutable fields of an existing work order.</summary>
        public async Task<WorkOrderDetailDto?> UpdateWorkOrderAsync(
            int workOrderId, UpdateWorkOrderRequest request, int modifiedByUserId)
        {
            var wo = await _db.WorkOrders.FindAsync(workOrderId);
            if (wo == null) return null;

            if (request.Status != null) wo.Status = request.Status;
            if (request.Subject != null) wo.Subject = request.Subject;
            if (request.Description != null) wo.Description = request.Description;
            if (request.AssignedMechanicID.HasValue) wo.AssignedMechanicID = request.AssignedMechanicID;
            if (request.ActualStartDate.HasValue) wo.ActualStartDate = request.ActualStartDate;
            if (request.ActualEndDate.HasValue) wo.ActualEndDate = request.ActualEndDate;
            if (request.ActualSMR.HasValue) wo.ActualSMR = request.ActualSMR;
            if (request.TSRDataScore.HasValue) wo.TSRDataScore = request.TSRDataScore.Value;
            if (request.TSRRootCauseScore.HasValue) wo.TSRRootCauseScore = request.TSRRootCauseScore.Value;
            if (request.TSRMonitoringScore.HasValue) wo.TSRMonitoringScore = request.TSRMonitoringScore.Value;

            wo.LastModifiedDate = DateTime.UtcNow;
            wo.LastModifiedBy = modifiedByUserId;

            await _db.SaveChangesAsync();
            _logger.LogInformation("WorkOrder updated. WO_ID={WoId}", workOrderId);

            return await GetWorkOrderByIdAsync(workOrderId);
        }

        /// <summary>Deletes a work order (Admin only in controllers).</summary>
        public async Task<bool> DeleteWorkOrderAsync(int workOrderId)
        {
            var wo = await _db.WorkOrders.FindAsync(workOrderId);
            if (wo == null) return false;

            _db.WorkOrders.Remove(wo);
            await _db.SaveChangesAsync();
            _logger.LogWarning("WorkOrder deleted. WO_ID={WoId}", workOrderId);
            return true;
        }

        // ─────────────────────────────── private ─────────────────────────────

        private async Task<string> GenerateWorkOrderNumberAsync()
        {
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var prefix = $"WO-{datePart}-";
            var last = await _db.WorkOrders
                .Where(w => w.WorkOrderNumber.StartsWith(prefix))
                .OrderByDescending(w => w.WorkOrderNumber)
                .FirstOrDefaultAsync();

            int seq = 1;
            if (last != null)
            {
                var parts = last.WorkOrderNumber.Split('-');
                if (parts.Length == 3 && int.TryParse(parts[2], out int lastSeq))
                    seq = lastSeq + 1;
            }
            return $"{prefix}{seq:D5}";
        }

        private static WorkOrderDto MapToDto(WorkOrder w) => new()
        {
            WorkOrderID = w.WorkOrderID,
            WorkOrderNumber = w.WorkOrderNumber,
            CaseID = w.CaseID,
            CaseNumber = w.Case?.CaseNumber ?? string.Empty,
            Status = w.Status,
            Subject = w.Subject,
            AssetName = w.Asset?.AssetName,
            AccountName = w.Account?.AccountName,
            AssignedMechanicName = w.AssignedMechanic != null
                ? $"{w.AssignedMechanic.FirstName} {w.AssignedMechanic.LastName}".Trim()
                : null,
            StartDate = w.StartDate,
            EndDate = w.EndDate,
            CreatedDate = w.CreatedDate
        };

        private static WorkOrderDetailDto MapToDetailDto(WorkOrder w) => new()
        {
            WorkOrderID = w.WorkOrderID,
            WorkOrderNumber = w.WorkOrderNumber,
            CaseID = w.CaseID,
            CaseNumber = w.Case?.CaseNumber ?? string.Empty,
            Status = w.Status,
            Subject = w.Subject,
            Description = w.Description,
            AssetID = w.AssetID,
            AssetName = w.Asset?.AssetName,
            AccountID = w.AccountID,
            AccountName = w.Account?.AccountName,
            AssignedMechanicID = w.AssignedMechanicID,
            AssignedMechanicName = w.AssignedMechanic != null
                ? $"{w.AssignedMechanic.FirstName} {w.AssignedMechanic.LastName}".Trim()
                : null,
            StartDate = w.StartDate,
            EndDate = w.EndDate,
            WorkCenter = w.WorkCenter,
            Plant = w.Plant,
            LastSMR = w.LastSMR,
            ActualSMR = w.ActualSMR,
            TSRDataScore = w.TSRDataScore,
            TSRRootCauseScore = w.TSRRootCauseScore,
            TSRMonitoringScore = w.TSRMonitoringScore,
            BreakdownIndicator = w.BreakdownIndicator,
            SAPWorkOrderNumber = w.SAPWorkOrderNumber,
            CreatedDate = w.CreatedDate
        };
    }
}
