using Microsoft.EntityFrameworkCore;
using UT.ServiceConsole.API.Models.Entities;

namespace UT.ServiceConsole.API.Data
{
    /// <summary>
    /// Main EF Core DbContext for UT Service Console.
    /// Contains all 14 entity DbSets with relationship configuration and seed data.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <inheritdoc />
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<WorkOrder> WorkOrders { get; set; }
        public DbSet<CaseNote> CaseNotes { get; set; }
        public DbSet<WorkOrderNote> WorkOrderNotes { get; set; }
        public DbSet<SLA> SLAs { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        /// <inheritdoc />
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ─── User ─────────────────────────────────────────────────────────
            modelBuilder.Entity<User>(e =>
            {
                e.HasIndex(u => u.Username).IsUnique();
                e.HasIndex(u => u.Email).IsUnique();
                e.HasIndex(u => u.Role);
                e.HasIndex(u => u.IsActive);
                e.HasOne(u => u.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(u => u.CreatedBy)
                    .OnDelete(DeleteBehavior.SetNull);

                e.HasOne(u => u.LastModifiedByUser)
                    .WithMany()
                    .HasForeignKey(u => u.LastModifiedBy)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ─── Account ──────────────────────────────────────────────────────
            modelBuilder.Entity<Account>(e =>
            {
                e.HasIndex(a => a.AccountName).IsUnique();
                e.HasIndex(a => a.Status);
            });

            // ─── Contact ──────────────────────────────────────────────────────
            modelBuilder.Entity<Contact>(e =>
            {
                e.HasIndex(c => c.AccountID);
                e.HasOne(c => c.Account)
                    .WithMany(a => a.Contacts)
                    .HasForeignKey(c => c.AccountID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ─── Asset ────────────────────────────────────────────────────────
            modelBuilder.Entity<Asset>(e =>
            {
                e.HasIndex(a => a.EquipmentNumber).IsUnique();
                e.HasIndex(a => a.AccountID);
                e.HasIndex(a => a.Status);
                e.HasOne(a => a.Account)
                    .WithMany(acc => acc.Assets)
                    .HasForeignKey(a => a.AccountID)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ─── Case ─────────────────────────────────────────────────────────
            modelBuilder.Entity<Case>(e =>
            {
                e.HasIndex(c => c.CaseNumber).IsUnique();
                e.HasIndex(c => c.Status);
                e.HasIndex(c => c.Priority);
                e.HasIndex(c => c.CaseType);
                e.HasIndex(c => c.AssignedOwnerID);
                e.HasIndex(c => c.AccountID);
                e.HasIndex(c => c.AssetID);
                e.HasIndex(c => c.CreatedDate);
                e.HasIndex(c => new { c.Status, c.CreatedDate });
                e.HasIndex(c => new { c.AssignedOwnerID, c.Status });

                e.HasOne(c => c.AssignedOwner)
                    .WithMany()
                    .HasForeignKey(c => c.AssignedOwnerID)
                    .OnDelete(DeleteBehavior.SetNull);

                e.HasOne(c => c.Asset)
                    .WithMany()
                    .HasForeignKey(c => c.AssetID)
                    .OnDelete(DeleteBehavior.SetNull);

                e.HasOne(c => c.Account)
                    .WithMany(a => a.Cases)
                    .HasForeignKey(c => c.AccountID)
                    .OnDelete(DeleteBehavior.SetNull);

                e.HasOne(c => c.Contact)
                    .WithMany()
                    .HasForeignKey(c => c.ContactID)
                    .OnDelete(DeleteBehavior.SetNull);

                e.HasOne(c => c.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(c => c.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ─── WorkOrder ────────────────────────────────────────────────────
            modelBuilder.Entity<WorkOrder>(e =>
            {
                e.HasIndex(w => w.WorkOrderNumber).IsUnique();
                e.HasIndex(w => w.CaseID);
                e.HasIndex(w => w.Status);
                e.HasIndex(w => w.AssignedMechanicID);
                e.HasIndex(w => w.OwnerID);
                e.HasIndex(w => w.AccountID);
                e.HasIndex(w => w.AssetID);
                e.HasIndex(w => w.CreatedDate);
                e.HasIndex(w => new { w.Status, w.CreatedDate });
                e.HasIndex(w => new { w.AssignedMechanicID, w.Status });

                e.HasOne(w => w.Case)
                    .WithMany(c => c.WorkOrders)
                    .HasForeignKey(w => w.CaseID)
                    .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(w => w.Owner)
                    .WithMany()
                    .HasForeignKey(w => w.OwnerID)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(w => w.AssignedMechanic)
                    .WithMany()
                    .HasForeignKey(w => w.AssignedMechanicID)
                    .OnDelete(DeleteBehavior.SetNull);

                e.HasOne(w => w.Account)
                    .WithMany()
                    .HasForeignKey(w => w.AccountID)
                    .OnDelete(DeleteBehavior.SetNull);

                e.HasOne(w => w.Asset)
                    .WithMany()
                    .HasForeignKey(w => w.AssetID)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ─── CaseNote ─────────────────────────────────────────────────────
            modelBuilder.Entity<CaseNote>(e =>
            {
                e.HasIndex(n => n.CaseID);
                e.HasOne(n => n.Case)
                    .WithMany(c => c.Notes)
                    .HasForeignKey(n => n.CaseID)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(n => n.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(n => n.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ─── WorkOrderNote ────────────────────────────────────────────────
            modelBuilder.Entity<WorkOrderNote>(e =>
            {
                e.HasIndex(n => n.WorkOrderID);
                e.HasOne(n => n.WorkOrder)
                    .WithMany(w => w.Notes)
                    .HasForeignKey(n => n.WorkOrderID)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(n => n.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(n => n.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ─── SLA ──────────────────────────────────────────────────────────
            modelBuilder.Entity<SLA>(e =>
            {
                e.HasIndex(s => s.CaseID);
                e.HasIndex(s => s.SLAType);
                e.HasIndex(s => s.IsBreached);
                e.HasIndex(s => s.TargetDate);
                e.HasOne(s => s.Case)
                    .WithMany(c => c.SLAs)
                    .HasForeignKey(s => s.CaseID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ─── AuditLog ─────────────────────────────────────────────────────
            modelBuilder.Entity<AuditLog>(e =>
            {
                e.HasIndex(a => a.EntityName);
                e.HasIndex(a => a.EntityID);
                e.HasIndex(a => a.ActionType);
                e.HasIndex(a => a.ChangedDate);
                e.HasIndex(a => new { a.EntityName, a.EntityID, a.ChangedDate });
                e.HasOne(a => a.ChangedByUser)
                    .WithMany()
                    .HasForeignKey(a => a.ChangedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ─── LoginHistory ─────────────────────────────────────────────────
            modelBuilder.Entity<LoginHistory>(e =>
            {
                e.HasIndex(l => l.UserID);
                e.HasIndex(l => l.LoginDate);
                e.HasIndex(l => l.Success);
                e.HasIndex(l => new { l.UserID, l.LoginDate });
                e.HasOne(l => l.User)
                    .WithMany(u => u.LoginHistories)
                    .HasForeignKey(l => l.UserID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ─── Role ─────────────────────────────────────────────────────────
            modelBuilder.Entity<Role>(e =>
            {
                e.HasIndex(r => r.RoleName).IsUnique();
            });

            // ─── Permission ───────────────────────────────────────────────────
            modelBuilder.Entity<Permission>(e =>
            {
                e.HasIndex(p => p.PermissionName).IsUnique();
                e.HasIndex(p => p.Module);
            });

            // ─── RolePermission ───────────────────────────────────────────────
            modelBuilder.Entity<RolePermission>(e =>
            {
                e.HasKey(rp => new { rp.RoleID, rp.PermissionID });
                e.HasOne(rp => rp.Role).WithMany(r => r.RolePermissions)
                    .HasForeignKey(rp => rp.RoleID).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(rp => rp.Permission).WithMany(p => p.RolePermissions)
                    .HasForeignKey(rp => rp.PermissionID).OnDelete(DeleteBehavior.Cascade);
            });

            // ─── Seed Data ────────────────────────────────────────────────────
            SeedData(modelBuilder);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            // Pre-generated SHA-256+salt hashes (static so migrations are deterministic)
            // Login: admin@utconsole.com / Admin@2026!
            //        john.doe@utconsole.com / Service@2026!
            //        budi.santoso@utconsole.com / Mechanic@2026!
            //        manager.user@utconsole.com / Manager@2026!
            const string adminHash    = "gcejzwBoRT2kxdzOWnUL5g==:7TC+3QKZOL8eb+fRgWpd/RsO5WWfd19Q7xtCsa4St0M=";
            const string serviceHash  = "6cTTHQsdQMLvMo30T+/+wA==:lgHCvg4voUl8n3m+cz1PNPz7yzC1wdUniNci1Sb5JgU=";
            const string mechanicHash = "4AdLiqMOn4H2zfXihG5bzg==:kDbPFwW9bAKK3dCaV9R7GcOdc6GzfnGPr144RRJ/iNM=";
            const string managerHash  = "KG/VKYH1/sj0tUdDghMJkA==:VwVMqkzhMc+PXoJz8lP4GFQK0ZZQfATFliVLQS6nfDA=";

            modelBuilder.Entity<User>().HasData(
                new User { UserID = 1, Username = "admin", Email = "admin@utconsole.com", PasswordHash = adminHash, FirstName = "System", LastName = "Administrator", Role = "Admin", Department = "IT", PhoneNumber = "+62811234567", IsActive = true, CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new User { UserID = 2, Username = "john.doe", Email = "john.doe@utconsole.com", PasswordHash = serviceHash, FirstName = "John", LastName = "Doe", Role = "ServiceAdvisor", Department = "Operations", PhoneNumber = "+62811234568", IsActive = true, CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new User { UserID = 3, Username = "budi.santoso", Email = "budi.santoso@utconsole.com", PasswordHash = mechanicHash, FirstName = "Budi", LastName = "Santoso", Role = "Mechanic", Department = "Field Services", PhoneNumber = "+62811234569", IsActive = true, CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new User { UserID = 4, Username = "manager.user", Email = "manager.user@utconsole.com", PasswordHash = managerHash, FirstName = "Manager", LastName = "User", Role = "Manager", Department = "Operations", PhoneNumber = "+62811234570", IsActive = true, CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) }
            );

            modelBuilder.Entity<Account>().HasData(
                new Account { AccountID = 1, AccountName = "PUTRA PERKASA ABADI", CustomerSupportType = "Dedicated Customer", PhoneNumber = "+62-711-12345", Email = "contact@putraabadi.co.id", Industry = "MNG", City = "Palembang", Country = "Indonesia", Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new Account { AccountID = 2, AccountName = "SIMS JAYA KALTIM", CustomerSupportType = "Standard", PhoneNumber = "+62-541-98765", Email = "info@simskaltim.co.id", Industry = "MNG", City = "Samarinda", Country = "Indonesia", Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new Account { AccountID = 3, AccountName = "PT. UNITED TRACTORS", CustomerSupportType = "Premium", PhoneNumber = "+62-21-5555555", Email = "utgroup@unitedtractors.com", Industry = "EQP", City = "Jakarta", Country = "Indonesia", Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) }
            );

            modelBuilder.Entity<Asset>().HasData(
                new Asset { AssetID = 1, AssetName = "GD-829 Komatsu D85ESS-2", EquipmentNumber = "232656", SerialNumber = "13405", UnitModel = "Komatsu D85ESS-2", UnitCode = "GD-829", MaterialNumber = "GD825A-2/S3", SMR = 14250.0m, EquipmentUoM = "hm", Plant = "TJE", ServiceArea = "Tanjung Enim PPA", Location = "Site B - Pit 4", AccountID = 1, Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new Asset { AssetID = 2, AssetName = "GD-830 PC2000 Excavator", SerialNumber = "13406", UnitModel = "Komatsu PC2000", UnitCode = "GD-830", MaterialNumber = "PC2000-8", SMR = 12500.0m, EquipmentUoM = "hm", Plant = "TJE", ServiceArea = "Tanjung Enim PPA", Location = "Site A - Loading Area", AccountID = 1, Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new Asset { AssetID = 3, AssetName = "GD-831 HD785 Truck", EquipmentNumber = "232657", SerialNumber = "13407", UnitModel = "Komatsu HD785", UnitCode = "GD-831", MaterialNumber = "HD785-7", SMR = 16750.0m, EquipmentUoM = "km", Plant = "TJE", ServiceArea = "Tanjung Enim PPA", Location = "Transportation", AccountID = 2, Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) }
            );

            modelBuilder.Entity<Contact>().HasData(
                new Contact { ContactID = 1, ContactName = "Andi Wijaya", Email = "andi@putraabadi.co.id", PhoneNumber = "+62-811-111-2222", Title = "Operations Manager", Department = "Operations", AccountID = 1, IsPrimary = true, Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new Contact { ContactID = 2, ContactName = "Rini Kartika", Email = "rini@putraabadi.co.id", PhoneNumber = "+62-811-333-4444", Title = "Technical Lead", Department = "Maintenance", AccountID = 1, IsPrimary = false, Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) },
                new Contact { ContactID = 3, ContactName = "Burhan", Email = "burhan@simskaltim.co.id", PhoneNumber = "+62-811-555-6666", Title = "Fleet Manager", Department = "Fleet", AccountID = 2, IsPrimary = true, Status = "Active", CreatedDate = new DateTime(2026, 1, 1), LastModifiedDate = new DateTime(2026, 1, 1) }
            );

            modelBuilder.Entity<Case>().HasData(
                new Case { CaseID = 1, CaseNumber = "CASE-20260526-00101", CaseType = "Request", Priority = "Medium", Status = "Open", Subject = "Hydraulic Leak on Right Cylinder", Description = "Operator reported significant hydraulic fluid leakage near right cylinder. Equipment grounded pending repair.", AssetID = 1, AccountID = 1, ContactID = 1, AssignedOwnerID = 2, StartDate = new DateTime(2026, 5, 26, 7, 31, 0), CreatedDate = new DateTime(2026, 5, 26, 7, 31, 0), LastModifiedDate = new DateTime(2026, 5, 26, 7, 31, 0), CreatedBy = 2 },
                new Case { CaseID = 2, CaseNumber = "CASE-20260525-00100", CaseType = "Incident", Priority = "High", Status = "Assigned", Subject = "Engine Overheating Issue", Description = "Unit GD-830 experiencing elevated coolant temperatures. Initial diagnostics show potential radiator blockage or fan malfunction.", AssetID = 2, AccountID = 1, ContactID = 1, AssignedOwnerID = 2, StartDate = new DateTime(2026, 5, 25, 10, 15, 0), CreatedDate = new DateTime(2026, 5, 25, 10, 15, 0), LastModifiedDate = new DateTime(2026, 5, 25, 10, 15, 0), CreatedBy = 2 },
                new Case { CaseID = 3, CaseNumber = "CASE-20260524-00099", CaseType = "Problem", Priority = "Critical", Status = "InProgress", Subject = "Transmission Failure GD-831", Description = "Complete transmission failure reported during operation. Unit HD785 unable to shift gears. Requires major overhaul or replacement.", AssetID = 3, AccountID = 2, ContactID = 3, AssignedOwnerID = 4, StartDate = new DateTime(2026, 5, 24, 8, 0, 0), CreatedDate = new DateTime(2026, 5, 24, 8, 0, 0), LastModifiedDate = new DateTime(2026, 5, 24, 8, 0, 0), CreatedBy = 2 }
            );

            modelBuilder.Entity<WorkOrder>().HasData(
                new WorkOrder { WorkOrderID = 1, WorkOrderNumber = "WO-20260526-00101", CaseID = 1, Status = "New", OwnerID = 2, AssignedMechanicID = 3, AccountID = 1, ContactID = 1, AssetID = 1, Subject = "Hydraulic System Repair - GD-829", Description = "Replace hydraulic cylinder seal and hose assembly. Check fluid level and top up if necessary.", StartDate = new DateTime(2026, 5, 26, 7, 31, 0), EndDate = new DateTime(2026, 5, 27, 7, 31, 0), WorkCenter = "FM-TJEPA", Plant = "TJE", LastSMR = 14250.0m, CreatedDate = new DateTime(2026, 5, 26, 7, 31, 0), LastModifiedDate = new DateTime(2026, 5, 26, 7, 31, 0), CreatedBy = 2 },
                new WorkOrder { WorkOrderID = 2, WorkOrderNumber = "WO-20260525-00100", CaseID = 2, Status = "InProgress", OwnerID = 2, AssignedMechanicID = 3, AccountID = 1, ContactID = 1, AssetID = 2, Subject = "Engine Cooling System Diagnosis - GD-830", Description = "Inspect radiator, fans, and coolant system. Perform flush if blockage found. Test thermostat operation.", StartDate = new DateTime(2026, 5, 25, 10, 15, 0), EndDate = new DateTime(2026, 5, 26, 10, 15, 0), WorkCenter = "FM-TJEPA", Plant = "TJE", LastSMR = 12500.0m, CreatedDate = new DateTime(2026, 5, 25, 10, 15, 0), LastModifiedDate = new DateTime(2026, 5, 25, 10, 15, 0), CreatedBy = 2 },
                new WorkOrder { WorkOrderID = 3, WorkOrderNumber = "WO-20260524-00099", CaseID = 3, Status = "InProgress", OwnerID = 4, AssignedMechanicID = 3, AccountID = 2, ContactID = 3, AssetID = 3, Subject = "Transmission Overhaul - GD-831", Description = "Complete transmission tear-down and inspection. Identify failed components and plan replacement strategy.", StartDate = new DateTime(2026, 5, 24, 8, 0, 0), EndDate = new DateTime(2026, 5, 28, 8, 0, 0), WorkCenter = "FM-KALTIM", Plant = "KTM", LastSMR = 16750.0m, CreatedDate = new DateTime(2026, 5, 24, 8, 0, 0), LastModifiedDate = new DateTime(2026, 5, 24, 8, 0, 0), CreatedBy = 2 }
            );

            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Admin", Description = "System Administrator", IsActive = true, CreatedDate = new DateTime(2026, 1, 1) },
                new Role { RoleID = 2, RoleName = "Manager", Description = "Case Manager / Supervisor", IsActive = true, CreatedDate = new DateTime(2026, 1, 1) },
                new Role { RoleID = 3, RoleName = "ServiceAdvisor", Description = "Service Advisor / Case Creator", IsActive = true, CreatedDate = new DateTime(2026, 1, 1) },
                new Role { RoleID = 4, RoleName = "Mechanic", Description = "Field Mechanic / Technician", IsActive = true, CreatedDate = new DateTime(2026, 1, 1) }
            );
        }
    }
}
