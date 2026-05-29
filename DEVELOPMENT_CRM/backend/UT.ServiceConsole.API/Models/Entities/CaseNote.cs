using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Note / comment attached to a Case.</summary>
    [Table("CaseNotes")]
    public class CaseNote
    {
        [Key]
        public int NoteID { get; set; }

        public int CaseID { get; set; }

        [Required]
        public string NoteText { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public int CreatedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public int? LastModifiedBy { get; set; }

        [ForeignKey(nameof(CaseID))]
        public virtual Case Case { get; set; } = null!;

        [ForeignKey(nameof(CreatedBy))]
        public virtual User CreatedByUser { get; set; } = null!;
    }
}
