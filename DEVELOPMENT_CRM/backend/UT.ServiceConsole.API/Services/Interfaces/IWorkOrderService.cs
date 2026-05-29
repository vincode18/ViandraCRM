using System.Threading.Tasks;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Models.DTOs.WorkOrders;

namespace UT.ServiceConsole.API.Services.Interfaces
{
    /// <summary>Contract for Work Order management business logic.</summary>
    public interface IWorkOrderService
    {
        Task<PagedResult<WorkOrderDto>> GetWorkOrdersAsync(int page, int pageSize, string? status, string? search);
        Task<WorkOrderDetailDto?> GetWorkOrderByIdAsync(int workOrderId);
        Task<PagedResult<WorkOrderDto>> GetWorkOrdersByCaseAsync(int caseId);
        Task<WorkOrderDetailDto> CreateWorkOrderAsync(CreateWorkOrderRequest request, int createdByUserId);
        Task<WorkOrderDetailDto?> UpdateWorkOrderAsync(int workOrderId, UpdateWorkOrderRequest request, int modifiedByUserId);
        Task<bool> DeleteWorkOrderAsync(int workOrderId);
    }
}
