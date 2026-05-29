using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.IO;

namespace UT.ServiceConsole.API.Data
{
    /// <summary>
    /// Design-time factory used by EF Core CLI tools (dotnet ef migrations add / update).
    /// Uses SQLite with a local .db file — no database server required.
    /// </summary>
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        /// <inheritdoc />
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "ut_service_console.db");
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlite(
                $"Data Source={dbPath}",
                o => o.MigrationsAssembly("UT.ServiceConsole.API")
            );
            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
