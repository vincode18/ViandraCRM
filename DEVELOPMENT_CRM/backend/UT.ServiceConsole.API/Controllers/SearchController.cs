using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UT.ServiceConsole.API.Data;
using UT.ServiceConsole.API.Models.DTOs.Common;

namespace UT.ServiceConsole.API.Controllers
{
    /// <summary>
    /// Search endpoints for Account, Contact, and Asset entities.
    /// Used by Create Case form for autocomplete/searchable select fields.
    /// </summary>
    [ApiController]
    [Route("api/search")]
    [Authorize]
    [Produces("application/json")]
    public class SearchController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<SearchController> _logger;

        public SearchController(ApplicationDbContext db, ILogger<SearchController> logger)
        {
            _db = db;
            _logger = logger;
        }

        /// <summary>
        /// Search Accounts by name, ID, or other indexed fields.
        /// </summary>
        /// <param name="query">Search query (min 1 character)</param>
        /// <param name="limit">Max results to return (default 10)</param>
        /// <param name="offset">Pagination offset (default 0)</param>
        /// <returns>List of matching Accounts with metadata</returns>
        [HttpGet("accounts")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        public async Task<IActionResult> SearchAccounts(
            [FromQuery] string query = "",
            [FromQuery] int limit = 10,
            [FromQuery] int offset = 0)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                    return Ok(ApiResponse<object>.Ok(new { results = new List<object>() }, "Empty query"));

                var searchTerm = query.ToLower().Trim();
                var results = await _db.Accounts
                    .Where(a =>
                        a.AccountName.ToLower().Contains(searchTerm) ||
                        a.AccountID.ToString().Contains(searchTerm))
                    .OrderBy(a => a.AccountName)
                    .Skip(offset)
                    .Take(limit)
                    .Select(a => new
                    {
                        id = a.AccountID,
                        name = a.AccountName,
                        type = a.CustomerSupportType,
                        status = a.Status,
                        city = a.City,
                    })
                    .ToListAsync();

                var total = await _db.Accounts
                    .Where(a =>
                        a.AccountName.ToLower().Contains(searchTerm) ||
                        a.AccountID.ToString().Contains(searchTerm))
                    .CountAsync();

                return Ok(ApiResponse<object>.Ok(
                    new { results, total, limit, offset },
                    "Accounts found"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching accounts for query: {Query}", query);
                return BadRequest(ApiResponse<object>.Fail("Search failed. Please try again."));
            }
        }

        /// <summary>
        /// Search Contacts by name, email, phone, or Contact ID.
        /// Optionally filter by Account ID.
        /// </summary>
        /// <param name="query">Search query</param>
        /// <param name="accountId">Optional Account ID to filter by</param>
        /// <param name="limit">Max results (default 10)</param>
        /// <param name="offset">Pagination offset (default 0)</param>
        /// <returns>List of matching Contacts</returns>
        [HttpGet("contacts")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        public async Task<IActionResult> SearchContacts(
            [FromQuery] string query = "",
            [FromQuery] int? accountId = null,
            [FromQuery] int limit = 10,
            [FromQuery] int offset = 0)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query) && accountId == null)
                    return Ok(ApiResponse<object>.Ok(new { results = new List<object>() }, "Empty query"));

                var searchTerm = query.ToLower().Trim();
                var baseQuery = _db.Contacts.AsQueryable();

                // Filter by Account if provided
                if (accountId.HasValue)
                    baseQuery = baseQuery.Where(c => c.AccountID == accountId.Value);

                var results = await baseQuery
                    .Where(c =>
                        c.ContactName.ToLower().Contains(searchTerm) ||
                        c.Email.ToLower().Contains(searchTerm) ||
                        c.PhoneNumber.Contains(searchTerm) ||
                        c.ContactID.ToString().Contains(searchTerm))
                    .OrderBy(c => c.ContactName)
                    .Skip(offset)
                    .Take(limit)
                    .Select(c => new
                    {
                        id = c.ContactID,
                        name = c.ContactName,
                        email = c.Email,
                        phone = c.PhoneNumber,
                        title = c.Title,
                        accountId = c.AccountID,
                    })
                    .ToListAsync();

                var total = await baseQuery
                    .Where(c =>
                        c.ContactName.ToLower().Contains(searchTerm) ||
                        c.Email.ToLower().Contains(searchTerm) ||
                        c.PhoneNumber.Contains(searchTerm) ||
                        c.ContactID.ToString().Contains(searchTerm))
                    .CountAsync();

                return Ok(ApiResponse<object>.Ok(
                    new { results, total, limit, offset },
                    "Contacts found"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching contacts for query: {Query}", query);
                return BadRequest(ApiResponse<object>.Fail("Search failed. Please try again."));
            }
        }

        /// <summary>
        /// Search Assets by name, Asset ID, serial number, or type.
        /// Optionally filter by Account ID.
        /// </summary>
        /// <param name="query">Search query</param>
        /// <param name="accountId">Optional Account ID to filter by</param>
        /// <param name="limit">Max results (default 10)</param>
        /// <param name="offset">Pagination offset (default 0)</param>
        /// <returns>List of matching Assets</returns>
        [HttpGet("assets")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        public async Task<IActionResult> SearchAssets(
            [FromQuery] string query = "",
            [FromQuery] int? accountId = null,
            [FromQuery] int limit = 10,
            [FromQuery] int offset = 0)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query) && accountId == null)
                    return Ok(ApiResponse<object>.Ok(new { results = new List<object>() }, "Empty query"));

                var searchTerm = query.ToLower().Trim();
                var baseQuery = _db.Assets.AsQueryable();

                // Filter by Account if provided
                if (accountId.HasValue)
                    baseQuery = baseQuery.Where(a => a.AccountID == accountId.Value);

                var results = await baseQuery
                    .Where(a =>
                        a.AssetName.ToLower().Contains(searchTerm) ||
                        a.EquipmentNumber.Contains(searchTerm) ||
                        a.SerialNumber.Contains(searchTerm) ||
                        a.UnitModel.ToLower().Contains(searchTerm) ||
                        a.AssetID.ToString().Contains(searchTerm))
                    .OrderBy(a => a.AssetName)
                    .Skip(offset)
                    .Take(limit)
                    .Select(a => new
                    {
                        id = a.AssetID,
                        name = a.AssetName,
                        equipmentNumber = a.EquipmentNumber,
                        serialNumber = a.SerialNumber,
                        model = a.UnitModel,
                        status = a.Status,
                        accountId = a.AccountID,
                    })
                    .ToListAsync();

                var total = await baseQuery
                    .Where(a =>
                        a.AssetName.ToLower().Contains(searchTerm) ||
                        a.EquipmentNumber.Contains(searchTerm) ||
                        a.SerialNumber.Contains(searchTerm) ||
                        a.UnitModel.ToLower().Contains(searchTerm) ||
                        a.AssetID.ToString().Contains(searchTerm))
                    .CountAsync();

                return Ok(ApiResponse<object>.Ok(
                    new { results, total, limit, offset },
                    "Assets found"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching assets for query: {Query}", query);
                return BadRequest(ApiResponse<object>.Fail("Search failed. Please try again."));
            }
        }
    }
}
