using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Join table for Role ↔ Permission many-to-many relationship.</summary>
    [Table("RolePermissions")]
    public class RolePermission
    {
        public int RoleID { get; set; }
        public int PermissionID { get; set; }

        [ForeignKey(nameof(RoleID))]
        public virtual Role Role { get; set; } = null!;

        [ForeignKey(nameof(PermissionID))]
        public virtual Permission Permission { get; set; } = null!;
    }
}
