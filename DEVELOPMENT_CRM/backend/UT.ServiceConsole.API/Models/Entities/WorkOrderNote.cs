using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Note / comment attached to a WorkOrder.</summary>
    [Table("WorkOrderNotes")]
    public class WorkOrderNote
    {
        [Key]
        public int NoteID { get; set; }

        public int WorkOrderID { get; set; }

        [Required]
        public string NoteText { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public int? LastModifiedBy { get; set; }

        [ForeignKey(nameof(WorkOrderID))]
        public virtual WorkOrder WorkOrder { get; set; } = null!;

        [ForeignKey(nameof(CreatedBy))]
        public virtual User CreatedByUser { get; set; } = null!;
    }
}
