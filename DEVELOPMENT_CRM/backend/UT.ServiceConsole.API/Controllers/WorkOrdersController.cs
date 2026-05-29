using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UT.ServiceConsole.API.Models.DTOs.Common;
using UT.ServiceConsole.API.Models.DTOs.WorkOrders;
using UT.ServiceConsole.API.Services.Interfaces;

namespace UT.ServiceConsole.API.Controllers
{
    /// <summary>
    /// CRUD endpoints for Work Orders.
    /// All endpoints require a valid JWT (Bearer token).
    /// </summary>
    [ApiController]
    [Route("api/workorders")]
    [Authorize]
    [Produces("application/json")]
    public class WorkOrdersController : ControllerBase
    {
        private readonly IWorkOrderService _woService;
        private readonly ILogger<WorkOrdersController> _logger;

        /// <inheritdoc />
        public WorkOrdersController(IWorkOrderService woService, ILogger<WorkOrdersController> logger)
        {
            _woService = woService;
            _logger = logger;
        }

        /// <summary>Returns a paginated list of work orders with optional filters.</summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<WorkOrderDto>>), 200)]
        public async Task<IActionResult> GetWorkOrders(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? status = null,
            [FromQuery] string? search = null)
        {
            var result = await _woService.GetWorkOrdersAsync(page, pageSize, status, search);
            return Ok(ApiResponse<PagedResult<WorkOrderDto>>.Ok(result));
        }

        /// <summary>Returns all work orders for a specific case.</summary>
        /// <param name="caseId">Parent case ID.</param>
        [HttpGet("by-case/{caseId:int}")]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<WorkOrderDto>>), 200)]
        public async Task<IActionResult> GetByCaseId(int caseId)
        {
            var result = await _woService.GetWorkOrdersByCaseAsync(caseId);
            return Ok(ApiResponse<PagedResult<WorkOrderDto>>.Ok(result));
        }

        /// <summary>Returns full details of a single work order.</summary>
        /// <param name="id">Work order primary key.</param>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<WorkOrderDetailDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetWorkOrder(int id)
        {
            var result = await _woService.GetWorkOrderByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<object>.Fail($"Work Order #{id} not found."));

            return Ok(ApiResponse<WorkOrderDetailDto>.Ok(result));
        }

        /// <summary>Creates a new work order linked to an existing case.</summary>
        /// <param name="request">Work order creation payload.</param>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<WorkOrderDetailDto>), 201)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        public async Task<IActionResult> CreateWorkOrder([FromBody] CreateWorkOrderRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail("Validation failed.",
                    ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()));

            var userId = GetCurrentUserId();
            var result = await _woService.CreateWorkOrderAsync(request, userId);
            return CreatedAtAction(nameof(GetWorkOrder), new { id = result.WorkOrderID },
                ApiResponse<WorkOrderDetailDto>.Ok(result, "Work Order created successfully."));
        }

        /// <summary>Updates an existing work order (status, mechanic, scores, etc.).</summary>
        /// <param name="id">Work order primary key.</param>
        /// <param name="request">Fields to update (null fields are ignored).</param>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<WorkOrderDetailDto>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateWorkOrder(int id, [FromBody] UpdateWorkOrderRequest request)
        {
            var userId = GetCurrentUserId();
            var result = await _woService.UpdateWorkOrderAsync(id, request, userId);
            if (result == null)
                return NotFound(ApiResponse<object>.Fail($"Work Order #{id} not found."));

            return Ok(ApiResponse<WorkOrderDetailDto>.Ok(result, "Work Order updated successfully."));
        }

        /// <summary>Permanently deletes a work order (Admin role required).</summary>
        /// <param name="id">Work order primary key.</param>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteWorkOrder(int id)
        {
            var success = await _woService.DeleteWorkOrderAsync(id);
            if (!success)
                return NotFound(ApiResponse<object>.Fail($"Work Order #{id} not found."));

            return Ok(ApiResponse<object>.Ok(null, "Work Order deleted."));
        }

        private int GetCurrentUserId()
        {
            int.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out int id);
            return id;
        }
    }
}
