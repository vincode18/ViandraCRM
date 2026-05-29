using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UT.ServiceConsole.API.Models.Entities
{
    /// <summary>Equipment / machinery asset record.</summary>
    [Table("Assets")]
    public class Asset
    {
        [Key]
        public int AssetID { get; set; }

        [Required, MaxLength(200)]
        public string AssetName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? EquipmentNumber { get; set; }

        [MaxLength(100)]
        public string? SerialNumber { get; set; }

        [MaxLength(100)]
        public string? UnitModel { get; set; }

        [MaxLength(50)]
        public string? UnitCode { get; set; }

        [MaxLength(100)]
        public string? MaterialNumber { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? SMR { get; set; }

        [MaxLength(20)]
        public string? EquipmentUoM { get; set; }

        public DateTime? MeasuringDate { get; set; }
        public DateTime? WarrantyStartDate { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public bool? InWarranty { get; set; }

        [MaxLength(50)]
        public string? Plant { get; set; }

        [MaxLength(100)]
        public string? ServiceArea { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        public int? AccountID { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public int? LastModifiedBy { get; set; }

        [ForeignKey(nameof(AccountID))]
        public virtual Account? Account { get; set; }
    }
}
