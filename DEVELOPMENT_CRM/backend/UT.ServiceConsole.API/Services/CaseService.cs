using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Models.DTOs.Cases;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Models.Entities;
using UT.ServiceConsole.API.Services.Interfaces;

namespace UT.ServiceConsole.API.Services
{
    /// <summary>
    /// Business logic for Case CRUD operations, case number generation, and status transitions.
    /// </summary>
    public class CaseService : ICaseService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<CaseService> _logger;

        /// <inheritdoc />
        public CaseService(ApplicationDbContext db, ILogger<CaseService> logger)
        {
            _db = db;
            _logger = logger;
        }

        /// <summary>Returns a paginated, filterable list of cases.</summary>
        public async Task<PagedResult<CaseDto>> GetCasesAsync(
            int page, int pageSize, string? status, string? priority, string? search)
        {
            var query = _db.Cases
                .Include(c => c.Asset)
                .Include(c => c.Account)
                .Include(c => c.AssignedOwner)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(c => c.Status == status);

            if (!string.IsNullOrWhiteSpace(priority))
                query = query.Where(c => c.Priority == priority);

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(c =>
                    c.CaseNumber.Contains(search) ||
                    c.Subject.Contains(search) ||
                    (c.Description != null && c.Description.Contains(search)));

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(c => c.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => MapToDto(c))
                .ToListAsync();

            return new PagedResult<CaseDto>
            {
                Items = items,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            };
        }

        /// <summary>Returns full case details including related entities.</summary>
        public async Task<CaseDetailDto?> GetCaseByIdAsync(int caseId)
        {
            var c = await _db.Cases
                .Include(x => x.Asset)
                .Include(x => x.Account)
                .Include(x => x.Contact)
                .Include(x => x.AssignedOwner)
                .FirstOrDefaultAsync(x => x.CaseID == caseId);

            return c == null ? null : MapToDetailDto(c);
        }

        /// <summary>Creates a new case with auto-generated case number.</summary>
        public async Task<CaseDetailDto> CreateCaseAsync(CreateCaseRequest request, int createdByUserId)
        {
            var caseNumber = await GenerateCaseNumberAsync();

            var caseEntity = new Case
            {
                CaseNumber = caseNumber,
                CaseType = request.CaseType,
                Priority = request.Priority,
                Status = "Open",
                Subject = request.Subject,
                Description = request.Description,
                AssetID = request.AssetID,
                AccountID = request.AccountID,
                ContactID = request.ContactID,
                AssignedOwnerID = request.AssignedOwnerID,
                StartDate = DateTime.UtcNow,
                TargetResolutionDate = request.TargetResolutionDate,
                CreatedDate = DateTime.UtcNow,
                LastModifiedDate = DateTime.UtcNow,
                CreatedBy = createdByUserId
            };

            _db.Cases.Add(caseEntity);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Case created. CaseID={CaseId} Number={CaseNumber}", caseEntity.CaseID, caseNumber);

            return (await GetCaseByIdAsync(caseEntity.CaseID))!;
        }

        /// <summary>Updates mutable fields of an existing case.</summary>
        public async Task<CaseDetailDto?> UpdateCaseAsync(int caseId, UpdateCaseRequest request, int modifiedByUserId)
        {
            var caseEntity = await _db.Cases.FindAsync(caseId);
            if (caseEntity == null) return null;

            if (request.Priority != null) caseEntity.Priority = request.Priority;
            if (request.Status != null)
            {
                caseEntity.Status = request.Status;
                if (request.Status == "Closed") caseEntity.ClosedDate = DateTime.UtcNow;
            }
            if (request.Subject != null) caseEntity.Subject = request.Subject;
            if (request.Description != null) caseEntity.Description = request.Description;
            if (request.AssignedOwnerID.HasValue) caseEntity.AssignedOwnerID = request.AssignedOwnerID;
            if (request.TargetResolutionDate.HasValue) caseEntity.TargetResolutionDate = request.TargetResolutionDate;
            if (request.ClosedDate.HasValue) caseEntity.ClosedDate = request.ClosedDate;

            caseEntity.LastModifiedDate = DateTime.UtcNow;
            caseEntity.LastModifiedBy = modifiedByUserId;

            await _db.SaveChangesAsync();
            _logger.LogInformation("Case updated. CaseID={CaseId}", caseId);

            return await GetCaseByIdAsync(caseId);
        }

        /// <summary>Soft-deletes a case (sets status to Closed) — hard delete not permitted in MVP.</summary>
        public async Task<bool> DeleteCaseAsync(int caseId)
        {
            var caseEntity = await _db.Cases.FindAsync(caseId);
            if (caseEntity == null) return false;

            _db.Cases.Remove(caseEntity);
            await _db.SaveChangesAsync();
            _logger.LogWarning("Case hard-deleted. CaseID={CaseId}", caseId);
            return true;
        }

        // ─────────────────────────────── private ─────────────────────────────

        private async Task<string> GenerateCaseNumberAsync()
        {
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var prefix = $"CASE-{datePart}-";
            var lastCase = await _db.Cases
                .Where(c => c.CaseNumber.StartsWith(prefix))
                .OrderByDescending(c => c.CaseNumber)
                .FirstOrDefaultAsync();

            int seq = 1;
            if (lastCase != null)
            {
                var parts = lastCase.CaseNumber.Split('-');
                if (parts.Length == 3 && int.TryParse(parts[2], out int last))
                    seq = last + 1;
            }
            return $"{prefix}{seq:D5}";
        }

        private static CaseDto MapToDto(Case c) => new()
        {
            CaseID = c.CaseID,
            CaseNumber = c.CaseNumber,
            CaseType = c.CaseType,
            Priority = c.Priority,
            Status = c.Status,
            Subject = c.Subject,
            AssetName = c.Asset?.AssetName,
            AccountName = c.Account?.AccountName,
            AssignedOwnerName = c.AssignedOwner != null
                ? $"{c.AssignedOwner.FirstName} {c.AssignedOwner.LastName}".Trim()
                : null,
            StartDate = c.StartDate,
            TargetResolutionDate = c.TargetResolutionDate,
            SLABreached = c.SLABreached,
            CreatedDate = c.CreatedDate
        };

        private static CaseDetailDto MapToDetailDto(Case c) => new()
        {
            CaseID = c.CaseID,
            CaseNumber = c.CaseNumber,
            CaseType = c.CaseType,
            Priority = c.Priority,
            Status = c.Status,
            Subject = c.Subject,
            Description = c.Description,
            AssetID = c.AssetID,
            AssetName = c.Asset?.AssetName,
            AccountID = c.AccountID,
            AccountName = c.Account?.AccountName,
            ContactID = c.ContactID,
            ContactName = c.Contact?.ContactName,
            AssignedOwnerID = c.AssignedOwnerID,
            AssignedOwnerName = c.AssignedOwner != null
                ? $"{c.AssignedOwner.FirstName} {c.AssignedOwner.LastName}".Trim()
                : null,
            StartDate = c.StartDate,
            TargetResolutionDate = c.TargetResolutionDate,
            ClosedDate = c.ClosedDate,
            SLABreached = c.SLABreached,
            ComplianceScore = c.ComplianceScore,
            CreatedDate = c.CreatedDate
        };
    }
}
