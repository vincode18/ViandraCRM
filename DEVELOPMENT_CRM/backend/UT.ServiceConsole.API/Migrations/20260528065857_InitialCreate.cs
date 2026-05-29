using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace UT.ServiceConsole.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    AccountID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AccountName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    CustomerSupportType = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    Website = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Industry = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Country = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.AccountID);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    PermissionID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PermissionName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Module = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.PermissionID);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleName = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Role = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Department = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    LastLoginDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    FailedLoginAttempts = table.Column<int>(type: "INTEGER", nullable: false),
                    IsLockedOut = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_Users_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Users_Users_LastModifiedBy",
                        column: x => x.LastModifiedBy,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    AssetID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AssetName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    EquipmentNumber = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    SerialNumber = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    UnitModel = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    UnitCode = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    MaterialNumber = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    SMR = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    EquipmentUoM = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    MeasuringDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    WarrantyStartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    WarrantyEndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    InWarranty = table.Column<bool>(type: "INTEGER", nullable: true),
                    Plant = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    ServiceArea = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Location = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    AccountID = table.Column<int>(type: "INTEGER", nullable: true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assets", x => x.AssetID);
                    table.ForeignKey(
                        name: "FK_Assets_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    ContactID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ContactName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 150, nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", maxLength: 20, nullable: true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Department = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    AccountID = table.Column<int>(type: "INTEGER", nullable: false),
                    IsPrimary = table.Column<bool>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: true),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.ContactID);
                    table.ForeignKey(
                        name: "FK_Contacts_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "INTEGER", nullable: false),
                    PermissionID = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.RoleID, x.PermissionID });
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionID",
                        column: x => x.PermissionID,
                        principalTable: "Permissions",
                        principalColumn: "PermissionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AuditLog",
                columns: table => new
                {
                    LogID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EntityName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    EntityID = table.Column<int>(type: "INTEGER", nullable: false),
                    ActionType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    FieldName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    OldValue = table.Column<string>(type: "TEXT", nullable: true),
                    NewValue = table.Column<string>(type: "TEXT", nullable: true),
                    ChangedBy = table.Column<int>(type: "INTEGER", nullable: false),
                    ChangedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IPAddress = table.Column<string>(type: "TEXT", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLog", x => x.LogID);
                    table.ForeignKey(
                        name: "FK_AuditLog_Users_ChangedBy",
                        column: x => x.ChangedBy,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LoginHistory",
                columns: table => new
                {
                    LoginID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserID = table.Column<int>(type: "INTEGER", nullable: false),
                    LoginDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LogoutDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IPAddress = table.Column<string>(type: "TEXT", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Success = table.Column<bool>(type: "INTEGER", nullable: false),
                    FailureReason = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginHistory", x => x.LoginID);
                    table.ForeignKey(
                        name: "FK_LoginHistory_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cases",
                columns: table => new
                {
                    CaseID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CaseNumber = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CaseType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Priority = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Subject = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    AssetID = table.Column<int>(type: "INTEGER", nullable: true),
                    AccountID = table.Column<int>(type: "INTEGER", nullable: true),
                    ContactID = table.Column<int>(type: "INTEGER", nullable: true),
                    AssignedOwnerID = table.Column<int>(type: "INTEGER", nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TargetResolutionDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ClosedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SLABreached = table.Column<bool>(type: "INTEGER", nullable: false),
                    ComplianceScore = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: false),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cases", x => x.CaseID);
                    table.ForeignKey(
                        name: "FK_Cases_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Cases_Assets_AssetID",
                        column: x => x.AssetID,
                        principalTable: "Assets",
                        principalColumn: "AssetID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Cases_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ContactID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Cases_Users_AssignedOwnerID",
                        column: x => x.AssignedOwnerID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Cases_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CaseNotes",
                columns: table => new
                {
                    NoteID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CaseID = table.Column<int>(type: "INTEGER", nullable: false),
                    NoteText = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaseNotes", x => x.NoteID);
                    table.ForeignKey(
                        name: "FK_CaseNotes_Cases_CaseID",
                        column: x => x.CaseID,
                        principalTable: "Cases",
                        principalColumn: "CaseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CaseNotes_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SLA",
                columns: table => new
                {
                    SLAID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CaseID = table.Column<int>(type: "INTEGER", nullable: false),
                    SLAType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    TargetDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CompletionDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IsBreached = table.Column<bool>(type: "INTEGER", nullable: false),
                    BreachedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SLA", x => x.SLAID);
                    table.ForeignKey(
                        name: "FK_SLA_Cases_CaseID",
                        column: x => x.CaseID,
                        principalTable: "Cases",
                        principalColumn: "CaseID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkOrders",
                columns: table => new
                {
                    WorkOrderID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    WorkOrderNumber = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    CaseID = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    OwnerID = table.Column<int>(type: "INTEGER", nullable: false),
                    AssignedMechanicID = table.Column<int>(type: "INTEGER", nullable: true),
                    AccountID = table.Column<int>(type: "INTEGER", nullable: true),
                    ContactID = table.Column<int>(type: "INTEGER", nullable: true),
                    AssetID = table.Column<int>(type: "INTEGER", nullable: true),
                    Subject = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ActualStartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ActualEndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    WorkCenter = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    Plant = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CostCenter = table.Column<string>(type: "TEXT", maxLength: 100, nullable: true),
                    ObjectPart = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    SpecificObjectPart = table.Column<string>(type: "TEXT", maxLength: 200, nullable: true),
                    MalfunctionStartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    MalfunctionEndDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    BreakdownIndicator = table.Column<bool>(type: "INTEGER", nullable: false),
                    LastSMR = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    ActualSMR = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TSRDataScore = table.Column<int>(type: "INTEGER", nullable: false),
                    TSRRootCauseScore = table.Column<int>(type: "INTEGER", nullable: false),
                    TSRMonitoringScore = table.Column<int>(type: "INTEGER", nullable: false),
                    ABRFileDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SAPWorkOrderNumber = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: false),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkOrders", x => x.WorkOrderID);
                    table.ForeignKey(
                        name: "FK_WorkOrders_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WorkOrders_Assets_AssetID",
                        column: x => x.AssetID,
                        principalTable: "Assets",
                        principalColumn: "AssetID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WorkOrders_Cases_CaseID",
                        column: x => x.CaseID,
                        principalTable: "Cases",
                        principalColumn: "CaseID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkOrders_Users_AssignedMechanicID",
                        column: x => x.AssignedMechanicID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WorkOrders_Users_OwnerID",
                        column: x => x.OwnerID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WorkOrderNotes",
                columns: table => new
                {
                    NoteID = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    WorkOrderID = table.Column<int>(type: "INTEGER", nullable: false),
                    NoteText = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedBy = table.Column<int>(type: "INTEGER", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    LastModifiedBy = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkOrderNotes", x => x.NoteID);
                    table.ForeignKey(
                        name: "FK_WorkOrderNotes_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WorkOrderNotes_WorkOrders_WorkOrderID",
                        column: x => x.WorkOrderID,
                        principalTable: "WorkOrders",
                        principalColumn: "WorkOrderID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "AccountID", "AccountName", "Address", "City", "Country", "CreatedBy", "CreatedDate", "CustomerSupportType", "Email", "Industry", "LastModifiedBy", "LastModifiedDate", "PhoneNumber", "PostalCode", "State", "Status", "Website" },
                values: new object[,]
                {
                    { 1, "PUTRA PERKASA ABADI", null, "Palembang", "Indonesia", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Dedicated Customer", "contact@putraabadi.co.id", "MNG", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "+62-711-12345", null, null, "Active", null },
                    { 2, "SIMS JAYA KALTIM", null, "Samarinda", "Indonesia", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Standard", "info@simskaltim.co.id", "MNG", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "+62-541-98765", null, null, "Active", null },
                    { 3, "PT. UNITED TRACTORS", null, "Jakarta", "Indonesia", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Premium", "utgroup@unitedtractors.com", "EQP", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "+62-21-5555555", null, null, "Active", null }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleID", "CreatedDate", "Description", "IsActive", "RoleName" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "System Administrator", true, "Admin" },
                    { 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Case Manager / Supervisor", true, "Manager" },
                    { 3, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Service Advisor / Case Creator", true, "ServiceAdvisor" },
                    { 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Field Mechanic / Technician", true, "Mechanic" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserID", "CreatedBy", "CreatedDate", "Department", "Email", "FailedLoginAttempts", "FirstName", "IsActive", "IsLockedOut", "LastLoginDate", "LastModifiedBy", "LastModifiedDate", "LastName", "LockoutEndDate", "PasswordHash", "PhoneNumber", "Role", "Username" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "IT", "admin@utconsole.com", 0, "System", true, false, null, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Administrator", null, "gcejzwBoRT2kxdzOWnUL5g==:7TC+3QKZOL8eb+fRgWpd/RsO5WWfd19Q7xtCsa4St0M=", "+62811234567", "Admin", "admin" },
                    { 2, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Operations", "john.doe@utconsole.com", 0, "John", true, false, null, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Doe", null, "6cTTHQsdQMLvMo30T+/+wA==:lgHCvg4voUl8n3m+cz1PNPz7yzC1wdUniNci1Sb5JgU=", "+62811234568", "ServiceAdvisor", "john.doe" },
                    { 3, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Field Services", "budi.santoso@utconsole.com", 0, "Budi", true, false, null, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Santoso", null, "4AdLiqMOn4H2zfXihG5bzg==:kDbPFwW9bAKK3dCaV9R7GcOdc6GzfnGPr144RRJ/iNM=", "+62811234569", "Mechanic", "budi.santoso" },
                    { 4, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Operations", "manager.user@utconsole.com", 0, "Manager", true, false, null, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "User", null, "KG/VKYH1/sj0tUdDghMJkA==:VwVMqkzhMc+PXoJz8lP4GFQK0ZZQfATFliVLQS6nfDA=", "+62811234570", "Manager", "manager.user" }
                });

            migrationBuilder.InsertData(
                table: "Assets",
                columns: new[] { "AssetID", "AccountID", "AssetName", "CreatedBy", "CreatedDate", "EquipmentNumber", "EquipmentUoM", "InWarranty", "LastModifiedBy", "LastModifiedDate", "Location", "MaterialNumber", "MeasuringDate", "Plant", "SMR", "SerialNumber", "ServiceArea", "Status", "UnitCode", "UnitModel", "WarrantyEndDate", "WarrantyStartDate" },
                values: new object[,]
                {
                    { 1, 1, "GD-829 Komatsu D85ESS-2", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "232656", "hm", null, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Site B - Pit 4", "GD825A-2/S3", null, "TJE", 14250.0m, "13405", "Tanjung Enim PPA", "Active", "GD-829", "Komatsu D85ESS-2", null, null },
                    { 2, 1, "GD-830 PC2000 Excavator", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "hm", null, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Site A - Loading Area", "PC2000-8", null, "TJE", 12500.0m, "13406", "Tanjung Enim PPA", "Active", "GD-830", "Komatsu PC2000", null, null },
                    { 3, 2, "GD-831 HD785 Truck", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "232657", "km", null, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Transportation", "HD785-7", null, "TJE", 16750.0m, "13407", "Tanjung Enim PPA", "Active", "GD-831", "Komatsu HD785", null, null }
                });

            migrationBuilder.InsertData(
                table: "Contacts",
                columns: new[] { "ContactID", "AccountID", "ContactName", "CreatedBy", "CreatedDate", "Department", "Email", "IsPrimary", "LastModifiedBy", "LastModifiedDate", "PhoneNumber", "Status", "Title" },
                values: new object[,]
                {
                    { 1, 1, "Andi Wijaya", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Operations", "andi@putraabadi.co.id", true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "+62-811-111-2222", "Active", "Operations Manager" },
                    { 2, 1, "Rini Kartika", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Maintenance", "rini@putraabadi.co.id", false, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "+62-811-333-4444", "Active", "Technical Lead" },
                    { 3, 2, "Burhan", null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Fleet", "burhan@simskaltim.co.id", true, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "+62-811-555-6666", "Active", "Fleet Manager" }
                });

            migrationBuilder.InsertData(
                table: "Cases",
                columns: new[] { "CaseID", "AccountID", "AssetID", "AssignedOwnerID", "CaseNumber", "CaseType", "ClosedDate", "ComplianceScore", "ContactID", "CreatedBy", "CreatedDate", "Description", "LastModifiedBy", "LastModifiedDate", "Priority", "SLABreached", "StartDate", "Status", "Subject", "TargetResolutionDate" },
                values: new object[,]
                {
                    { 1, 1, 1, 2, "CASE-20260526-00101", "Request", null, null, 1, 2, new DateTime(2026, 5, 26, 7, 31, 0, 0, DateTimeKind.Unspecified), "Operator reported significant hydraulic fluid leakage near right cylinder. Equipment grounded pending repair.", null, new DateTime(2026, 5, 26, 7, 31, 0, 0, DateTimeKind.Unspecified), "Medium", false, new DateTime(2026, 5, 26, 7, 31, 0, 0, DateTimeKind.Unspecified), "Open", "Hydraulic Leak on Right Cylinder", null },
                    { 2, 1, 2, 2, "CASE-20260525-00100", "Incident", null, null, 1, 2, new DateTime(2026, 5, 25, 10, 15, 0, 0, DateTimeKind.Unspecified), "Unit GD-830 experiencing elevated coolant temperatures. Initial diagnostics show potential radiator blockage or fan malfunction.", null, new DateTime(2026, 5, 25, 10, 15, 0, 0, DateTimeKind.Unspecified), "High", false, new DateTime(2026, 5, 25, 10, 15, 0, 0, DateTimeKind.Unspecified), "Assigned", "Engine Overheating Issue", null },
                    { 3, 2, 3, 4, "CASE-20260524-00099", "Problem", null, null, 3, 2, new DateTime(2026, 5, 24, 8, 0, 0, 0, DateTimeKind.Unspecified), "Complete transmission failure reported during operation. Unit HD785 unable to shift gears. Requires major overhaul or replacement.", null, new DateTime(2026, 5, 24, 8, 0, 0, 0, DateTimeKind.Unspecified), "Critical", false, new DateTime(2026, 5, 24, 8, 0, 0, 0, DateTimeKind.Unspecified), "InProgress", "Transmission Failure GD-831", null }
                });

            migrationBuilder.InsertData(
                table: "WorkOrders",
                columns: new[] { "WorkOrderID", "ABRFileDate", "AccountID", "ActualEndDate", "ActualSMR", "ActualStartDate", "AssetID", "AssignedMechanicID", "BreakdownIndicator", "CaseID", "ContactID", "CostCenter", "CreatedBy", "CreatedDate", "Description", "EndDate", "LastModifiedBy", "LastModifiedDate", "LastSMR", "MalfunctionEndDate", "MalfunctionStartDate", "ObjectPart", "OwnerID", "Plant", "SAPWorkOrderNumber", "SpecificObjectPart", "StartDate", "Status", "Subject", "TSRDataScore", "TSRMonitoringScore", "TSRRootCauseScore", "WorkCenter", "WorkOrderNumber" },
                values: new object[,]
                {
                    { 1, null, 1, null, null, null, 1, 3, false, 1, 1, null, 2, new DateTime(2026, 5, 26, 7, 31, 0, 0, DateTimeKind.Unspecified), "Replace hydraulic cylinder seal and hose assembly. Check fluid level and top up if necessary.", new DateTime(2026, 5, 27, 7, 31, 0, 0, DateTimeKind.Unspecified), null, new DateTime(2026, 5, 26, 7, 31, 0, 0, DateTimeKind.Unspecified), 14250.0m, null, null, null, 2, "TJE", null, null, new DateTime(2026, 5, 26, 7, 31, 0, 0, DateTimeKind.Unspecified), "New", "Hydraulic System Repair - GD-829", 0, 0, 0, "FM-TJEPA", "WO-20260526-00101" },
                    { 2, null, 1, null, null, null, 2, 3, false, 2, 1, null, 2, new DateTime(2026, 5, 25, 10, 15, 0, 0, DateTimeKind.Unspecified), "Inspect radiator, fans, and coolant system. Perform flush if blockage found. Test thermostat operation.", new DateTime(2026, 5, 26, 10, 15, 0, 0, DateTimeKind.Unspecified), null, new DateTime(2026, 5, 25, 10, 15, 0, 0, DateTimeKind.Unspecified), 12500.0m, null, null, null, 2, "TJE", null, null, new DateTime(2026, 5, 25, 10, 15, 0, 0, DateTimeKind.Unspecified), "InProgress", "Engine Cooling System Diagnosis - GD-830", 0, 0, 0, "FM-TJEPA", "WO-20260525-00100" },
                    { 3, null, 2, null, null, null, 3, 3, false, 3, 3, null, 2, new DateTime(2026, 5, 24, 8, 0, 0, 0, DateTimeKind.Unspecified), "Complete transmission tear-down and inspection. Identify failed components and plan replacement strategy.", new DateTime(2026, 5, 28, 8, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(2026, 5, 24, 8, 0, 0, 0, DateTimeKind.Unspecified), 16750.0m, null, null, null, 4, "KTM", null, null, new DateTime(2026, 5, 24, 8, 0, 0, 0, DateTimeKind.Unspecified), "InProgress", "Transmission Overhaul - GD-831", 0, 0, 0, "FM-KALTIM", "WO-20260524-00099" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_AccountName",
                table: "Accounts",
                column: "AccountName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_Status",
                table: "Accounts",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_AccountID",
                table: "Assets",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_EquipmentNumber",
                table: "Assets",
                column: "EquipmentNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Status",
                table: "Assets",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_ActionType",
                table: "AuditLog",
                column: "ActionType");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_ChangedBy",
                table: "AuditLog",
                column: "ChangedBy");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_ChangedDate",
                table: "AuditLog",
                column: "ChangedDate");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_EntityID",
                table: "AuditLog",
                column: "EntityID");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_EntityName",
                table: "AuditLog",
                column: "EntityName");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_EntityName_EntityID_ChangedDate",
                table: "AuditLog",
                columns: new[] { "EntityName", "EntityID", "ChangedDate" });

            migrationBuilder.CreateIndex(
                name: "IX_CaseNotes_CaseID",
                table: "CaseNotes",
                column: "CaseID");

            migrationBuilder.CreateIndex(
                name: "IX_CaseNotes_CreatedBy",
                table: "CaseNotes",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_AccountID",
                table: "Cases",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_AssetID",
                table: "Cases",
                column: "AssetID");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_AssignedOwnerID",
                table: "Cases",
                column: "AssignedOwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_AssignedOwnerID_Status",
                table: "Cases",
                columns: new[] { "AssignedOwnerID", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Cases_CaseNumber",
                table: "Cases",
                column: "CaseNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cases_CaseType",
                table: "Cases",
                column: "CaseType");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_ContactID",
                table: "Cases",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_CreatedBy",
                table: "Cases",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_CreatedDate",
                table: "Cases",
                column: "CreatedDate");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_Priority",
                table: "Cases",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_Status",
                table: "Cases",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_Status_CreatedDate",
                table: "Cases",
                columns: new[] { "Status", "CreatedDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_AccountID",
                table: "Contacts",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_LoginDate",
                table: "LoginHistory",
                column: "LoginDate");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_Success",
                table: "LoginHistory",
                column: "Success");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_UserID",
                table: "LoginHistory",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_UserID_LoginDate",
                table: "LoginHistory",
                columns: new[] { "UserID", "LoginDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_Module",
                table: "Permissions",
                column: "Module");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_PermissionName",
                table: "Permissions",
                column: "PermissionName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionID",
                table: "RolePermissions",
                column: "PermissionID");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_RoleName",
                table: "Roles",
                column: "RoleName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SLA_CaseID",
                table: "SLA",
                column: "CaseID");

            migrationBuilder.CreateIndex(
                name: "IX_SLA_IsBreached",
                table: "SLA",
                column: "IsBreached");

            migrationBuilder.CreateIndex(
                name: "IX_SLA_SLAType",
                table: "SLA",
                column: "SLAType");

            migrationBuilder.CreateIndex(
                name: "IX_SLA_TargetDate",
                table: "SLA",
                column: "TargetDate");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CreatedBy",
                table: "Users",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsActive",
                table: "Users",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Users_LastModifiedBy",
                table: "Users",
                column: "LastModifiedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Role",
                table: "Users",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderNotes_CreatedBy",
                table: "WorkOrderNotes",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderNotes_WorkOrderID",
                table: "WorkOrderNotes",
                column: "WorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_AccountID",
                table: "WorkOrders",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_AssetID",
                table: "WorkOrders",
                column: "AssetID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_AssignedMechanicID",
                table: "WorkOrders",
                column: "AssignedMechanicID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_AssignedMechanicID_Status",
                table: "WorkOrders",
                columns: new[] { "AssignedMechanicID", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_CaseID",
                table: "WorkOrders",
                column: "CaseID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_CreatedDate",
                table: "WorkOrders",
                column: "CreatedDate");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_OwnerID",
                table: "WorkOrders",
                column: "OwnerID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_Status",
                table: "WorkOrders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_Status_CreatedDate",
                table: "WorkOrders",
                columns: new[] { "Status", "CreatedDate" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_WorkOrderNumber",
                table: "WorkOrders",
                column: "WorkOrderNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLog");

            migrationBuilder.DropTable(
                name: "CaseNotes");

            migrationBuilder.DropTable(
                name: "LoginHistory");

            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "SLA");

            migrationBuilder.DropTable(
                name: "WorkOrderNotes");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "WorkOrders");

            migrationBuilder.DropTable(
                name: "Cases");

            migrationBuilder.DropTable(
                name: "Assets");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Accounts");
        }
    }
}
