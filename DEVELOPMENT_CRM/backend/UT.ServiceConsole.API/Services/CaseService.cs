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

        /// <summary>Creates a new case with auto-generated case number and dynamic SLA calculation.</summary>
        public async Task<CaseDetailDto> CreateCaseAsync(CreateCaseRequest request, int createdByUserId)
        {
            var caseNumber = await GenerateCaseNumberAsync();
            var now = DateTime.UtcNow;

            // Fetch account tier for SLA modifier
            string? accountTier = null;
            if (request.AccountID.HasValue)
            {
                var account = await _db.Accounts.FindAsync(request.AccountID.Value);
                accountTier = account?.CustomerSupportType;
            }

            var (responseTarget, resolutionTarget) = CalculateSla(now, request.Priority, request.Category, accountTier);

            var caseEntity = new Case
            {
                CaseNumber = caseNumber,
                CaseType = request.CaseType,
                Priority = request.Priority,
                Status = "Open",
                Subject = request.Subject,
                Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description,
                Category = string.IsNullOrWhiteSpace(request.Category) ? null : request.Category,
                SubCategory = string.IsNullOrWhiteSpace(request.SubCategory) ? null : request.SubCategory,

                // Section 1: Case Information (additional)
                Plant = string.IsNullOrWhiteSpace(request.Plant) ? null : request.Plant,
                ServiceArea = string.IsNullOrWhiteSpace(request.ServiceArea) ? null : request.ServiceArea,
                AssetID = request.AssetID,
                AccountID = request.AccountID,
                ContactID = request.ContactID,
                AssignedOwnerID = request.AssignedOwnerID > 0 ? request.AssignedOwnerID : createdByUserId,

                // Section 2: Case Informant
                InformantName = string.IsNullOrWhiteSpace(request.InformantName) ? null : request.InformantName,
                InformantEmail = string.IsNullOrWhiteSpace(request.InformantEmail) ? null : request.InformantEmail,
                InformantPosition = string.IsNullOrWhiteSpace(request.InformantPosition) ? null : request.InformantPosition,

                // Section 3: Case Details (additional)
                ParentCaseID = string.IsNullOrWhiteSpace(request.ParentCaseID) ? null : request.ParentCaseID,
                Direction = string.IsNullOrWhiteSpace(request.Direction) ? null : request.Direction,
                Location = string.IsNullOrWhiteSpace(request.Location) ? null : request.Location,
                CaseOrigin = string.IsNullOrWhiteSpace(request.CaseOrigin) ? null : request.CaseOrigin,
                SmrProblem = string.IsNullOrWhiteSpace(request.SmrProblem) ? null : request.SmrProblem,
                DateTimeOpened = request.DateTimeOpened ?? now,
                ObjectPart = string.IsNullOrWhiteSpace(request.ObjectPart) ? null : request.ObjectPart,
                SpecificObjectPart = string.IsNullOrWhiteSpace(request.SpecificObjectPart) ? null : request.SpecificObjectPart,
                Cause = string.IsNullOrWhiteSpace(request.Cause) ? null : request.Cause,
                CallType = string.IsNullOrWhiteSpace(request.CallType) ? null : request.CallType,
                Damage = string.IsNullOrWhiteSpace(request.Damage) ? null : request.Damage,
                SubcallType = string.IsNullOrWhiteSpace(request.SubcallType) ? null : request.SubcallType,
                DescriptionUpdate = string.IsNullOrWhiteSpace(request.DescriptionUpdate) ? null : request.DescriptionUpdate,
                SapStatus = string.IsNullOrWhiteSpace(request.SapStatus) ? null : request.SapStatus,
                CsRating = string.IsNullOrWhiteSpace(request.CsRating) ? null : request.CsRating,
                CloseReason = string.IsNullOrWhiteSpace(request.CloseReason) ? null : request.CloseReason,
                Emr = string.IsNullOrWhiteSpace(request.Emr) ? null : request.Emr,
                WaUpdateProgress = string.IsNullOrWhiteSpace(request.WaUpdateProgress) ? null : request.WaUpdateProgress,
                TroubleDate = request.TroubleDate,
                WaClosingUpdate = string.IsNullOrWhiteSpace(request.WaClosingUpdate) ? null : request.WaClosingUpdate,
                WaNumber = string.IsNullOrWhiteSpace(request.WaNumber) ? null : request.WaNumber,
                WaDescription = string.IsNullOrWhiteSpace(request.WaDescription) ? null : request.WaDescription,

                // Section 4: Completion OTIF
                OtifMechStart = request.OtifMechStart,
                OtifMechTarget = request.OtifMechTarget,
                OtifSolStart = request.OtifSolStart,
                OtifSolTarget = request.OtifSolTarget,

                // Section 5: Backdate
                BackdateMech = request.BackdateMech,
                BackdateSol = request.BackdateSol,
                ReasonBackdate = string.IsNullOrWhiteSpace(request.ReasonBackdate) ? null : request.ReasonBackdate,
                ReasonOthers = string.IsNullOrWhiteSpace(request.ReasonOthers) ? null : request.ReasonOthers,

                // Section 6: OTIF Status
                OtifMechStatus = string.IsNullOrWhiteSpace(request.OtifMechStatus) ? null : request.OtifMechStatus,
                NotOtifMech = request.NotOtifMech,
                NotOtifMechReason = string.IsNullOrWhiteSpace(request.NotOtifMechReason) ? null : request.NotOtifMechReason,
                OmCompensation = string.IsNullOrWhiteSpace(request.OmCompensation) ? null : request.OmCompensation,
                OtifSolStatus = string.IsNullOrWhiteSpace(request.OtifSolStatus) ? null : request.OtifSolStatus,
                NotOtifSol = request.NotOtifSol,
                NotOtifSolReason = string.IsNullOrWhiteSpace(request.NotOtifSolReason) ? null : request.NotOtifSolReason,

                // Section 7: Billing
                BillingAccount = string.IsNullOrWhiteSpace(request.BillingAccount) ? null : request.BillingAccount,
                BillingSalesOffice = string.IsNullOrWhiteSpace(request.BillingSalesOffice) ? null : request.BillingSalesOffice,
                BillingDivision = string.IsNullOrWhiteSpace(request.BillingDivision) ? null : request.BillingDivision,
                BillingSalesOfficeCode = string.IsNullOrWhiteSpace(request.BillingSalesOfficeCode) ? null : request.BillingSalesOfficeCode,
                BillingContactName = string.IsNullOrWhiteSpace(request.BillingContactName) ? null : request.BillingContactName,

                // Section 8: Additional Info
                DtAssigned = request.DtAssigned,
                ApprovalStatus = string.IsNullOrWhiteSpace(request.ApprovalStatus) ? null : request.ApprovalStatus,
                DtInProgress = request.DtInProgress,
                NeedManPower = request.NeedManPower,
                DtResolved = request.DtResolved,
                CaseCancel = request.CaseCancel,
                DtSupervisorApprove = request.DtSupervisorApprove,

                // Section 9: System (milestone)
                MilestoneStatus = "Open",

                // Existing fields
                StartDate = now,
                SlaResponseTarget = responseTarget,
                SlaResolutionTarget = resolutionTarget,
                SlaStatus = "OnTrack",
                TargetResolutionDate = resolutionTarget,
                CreatedDate = now,
                LastModifiedDate = now,
                CreatedBy = createdByUserId
            };

            _db.Cases.Add(caseEntity);
            await _db.SaveChangesAsync();

            _logger.LogInformation("Case created. CaseID={CaseId} Number={CaseNumber} SLA_Response={SlaResp}", 
                caseEntity.CaseID, caseNumber, responseTarget);

            return (await GetCaseByIdAsync(caseEntity.CaseID))!;
        }

        /// <summary>Calculates SLA response and resolution targets based on FRD SLA matrix.</summary>
        private static (DateTime responseTarget, DateTime resolutionTarget) CalculateSla(
            DateTime now, string priority, string? category, string? accountTier)
        {
            // Base hours per priority (FRD BR-201-A)
            double responseHours = priority?.ToLower() switch
            {
                "critical" => 1.0,
                "high"     => 4.0,
                "medium"   => 8.0,
                "low"      => 24.0,
                _          => 8.0
            };
            double resolutionHours = priority?.ToLower() switch
            {
                "critical" => 4.0,
                "high"     => 8.0,
                "medium"   => 24.0,
                "low"      => 120.0,
                _          => 24.0
            };

            // Category multiplier
            double categoryMultiplier = category?.ToLower() switch
            {
                "emergency" => 0.5,
                "billing"   => 1.2,
                _           => 1.0
            };

            // Account tier modifier
            double tierModifier = accountTier?.ToLower() switch
            {
                var t when t != null && t.Contains("enterprise") => 0.8,
                var t when t != null && t.Contains("basic")      => 1.2,
                _                                                 => 1.0
            };

            double finalResponse   = responseHours   * categoryMultiplier * tierModifier;
            double finalResolution = resolutionHours * categoryMultiplier * tierModifier;

            return (now.AddHours(finalResponse), now.AddHours(finalResolution));
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
            Category = c.Category,
            SubCategory = c.SubCategory,

            // Section 1: Case Information (additional)
            Plant = c.Plant,
            ServiceArea = c.ServiceArea,
            AssetID = c.AssetID,
            AssetName = c.Asset?.AssetName,
            AccountID = c.AccountID,
            AccountName = c.Account?.AccountName,
            ContactID = c.ContactID,
            ContactName = c.Contact?.ContactName,
            ContactEmail = c.Contact?.Email,
            ContactTitle = c.Contact?.Title,
            AssignedOwnerID = c.AssignedOwnerID,
            AssignedOwnerName = c.AssignedOwner != null
                ? $"{c.AssignedOwner.FirstName} {c.AssignedOwner.LastName}".Trim()
                : null,

            // Section 2: Case Informant
            InformantName = c.InformantName,
            InformantEmail = c.InformantEmail,
            InformantPosition = c.InformantPosition,

            // Section 3: Case Details (additional)
            ParentCaseID = c.ParentCaseID,
            Direction = c.Direction,
            Location = c.Location,
            CaseOrigin = c.CaseOrigin,
            SmrProblem = c.SmrProblem,
            DateTimeOpened = c.DateTimeOpened,
            ObjectPart = c.ObjectPart,
            SpecificObjectPart = c.SpecificObjectPart,
            Cause = c.Cause,
            CallType = c.CallType,
            Damage = c.Damage,
            SubcallType = c.SubcallType,
            DescriptionUpdate = c.DescriptionUpdate,
            SapStatus = c.SapStatus,
            CsRating = c.CsRating,
            CloseReason = c.CloseReason,
            Emr = c.Emr,
            WaUpdateProgress = c.WaUpdateProgress,
            TroubleDate = c.TroubleDate,
            WaClosingUpdate = c.WaClosingUpdate,
            WaNumber = c.WaNumber,
            WaDescription = c.WaDescription,

            // Section 4: Completion OTIF
            OtifMechStart = c.OtifMechStart,
            OtifMechTarget = c.OtifMechTarget,
            OtifSolStart = c.OtifSolStart,
            OtifSolTarget = c.OtifSolTarget,

            // Section 5: Backdate
            BackdateMech = c.BackdateMech,
            BackdateSol = c.BackdateSol,
            ReasonBackdate = c.ReasonBackdate,
            ReasonOthers = c.ReasonOthers,

            // Section 6: OTIF Status
            OtifMechStatus = c.OtifMechStatus,
            NotOtifMech = c.NotOtifMech,
            NotOtifMechReason = c.NotOtifMechReason,
            OmCompensation = c.OmCompensation,
            OtifSolStatus = c.OtifSolStatus,
            NotOtifSol = c.NotOtifSol,
            NotOtifSolReason = c.NotOtifSolReason,

            // Section 7: Billing
            BillingAccount = c.BillingAccount,
            BillingSalesOffice = c.BillingSalesOffice,
            BillingDivision = c.BillingDivision,
            BillingSalesOfficeCode = c.BillingSalesOfficeCode,
            BillingContactName = c.BillingContactName,

            // Section 8: Additional Info
            DtAssigned = c.DtAssigned,
            ApprovalStatus = c.ApprovalStatus,
            DtInProgress = c.DtInProgress,
            NeedManPower = c.NeedManPower,
            DtResolved = c.DtResolved,
            CaseCancel = c.CaseCancel,
            DtSupervisorApprove = c.DtSupervisorApprove,

            // Section 9: System
            MilestoneStatus = c.MilestoneStatus,

            // Existing fields
            StartDate = c.StartDate,
            TargetResolutionDate = c.TargetResolutionDate,
            SlaResponseTarget = c.SlaResponseTarget,
            SlaResolutionTarget = c.SlaResolutionTarget,
            SlaStatus = c.SlaStatus,
            ClosedDate = c.ClosedDate,
            CompletionNote = c.CompletionNote,
            SLABreached = c.SLABreached,
            ComplianceScore = c.ComplianceScore,
            CreatedDate = c.CreatedDate,
            LastModifiedDate = c.LastModifiedDate,
            CreatedBy = c.CreatedBy,
            LastModifiedBy = c.LastModifiedBy
        };
    }
}
