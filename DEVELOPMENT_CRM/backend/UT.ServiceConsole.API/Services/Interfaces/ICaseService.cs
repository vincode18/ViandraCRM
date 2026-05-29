using System.Threading.Tasks;
using UT.ServiceConsole.API.Models.DTOs.Cases;
using UT.ServiceConsole.API.Models.DTOs.Common;

namespace UT.ServiceConsole.API.Services.Interfaces
{
    /// <summary>Contract for Case management business logic.</summary>
    public interface ICaseService
    {
        Task<PagedResult<CaseDto>> GetCasesAsync(int page, int pageSize, string? status, string? priority, string? search);
        Task<CaseDetailDto?> GetCaseByIdAsync(int caseId);
        Task<CaseDetailDto> CreateCaseAsync(CreateCaseRequest request, int createdByUserId);
        Task<CaseDetailDto?> UpdateCaseAsync(int caseId, UpdateCaseRequest request, int modifiedByUserId);
        Task<bool> DeleteCaseAsync(int caseId);
    }
}
