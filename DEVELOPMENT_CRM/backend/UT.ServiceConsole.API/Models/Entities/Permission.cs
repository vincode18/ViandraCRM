using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Granular permission for RBAC.</summary>
    [Table("Permissions")]
    public class Permission
    {
        [Key]
        public int PermissionID { get; set; }

        [Required, MaxLength(100)]
        public string PermissionName { get; set; } = string.Empty;

        public string? Description { get; set; }

        [MaxLength(50)]
        public string? Module { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
