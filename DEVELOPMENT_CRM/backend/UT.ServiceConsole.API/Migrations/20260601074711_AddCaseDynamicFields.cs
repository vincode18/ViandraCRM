using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UT.ServiceConsole.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCaseDynamicFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompletionNote",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SlaResolutionTarget",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SlaResponseTarget",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SlaStatus",
                table: "Cases",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SubCategory",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Cases",
                keyColumn: "CaseID",
                keyValue: 1,
                columns: new[] { "Category", "CompletionNote", "SlaResolutionTarget", "SlaResponseTarget", "SlaStatus", "SubCategory" },
                values: new object[] { null, null, null, null, "OnTrack", null });

            migrationBuilder.UpdateData(
                table: "Cases",
                keyColumn: "CaseID",
                keyValue: 2,
                columns: new[] { "Category", "CompletionNote", "SlaResolutionTarget", "SlaResponseTarget", "SlaStatus", "SubCategory" },
                values: new object[] { null, null, null, null, "OnTrack", null });

            migrationBuilder.UpdateData(
                table: "Cases",
                keyColumn: "CaseID",
                keyValue: 3,
                columns: new[] { "Category", "CompletionNote", "SlaResolutionTarget", "SlaResponseTarget", "SlaStatus", "SubCategory" },
                values: new object[] { null, null, null, null, "OnTrack", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CompletionNote",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SlaResolutionTarget",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SlaResponseTarget",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SlaStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SubCategory",
                table: "Cases");
        }
    }
}
