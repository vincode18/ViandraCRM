using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UT.ServiceConsole.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFRDCaseDetailsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApprovalStatus",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BackdateMech",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BackdateSol",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingAccount",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingContactName",
                table: "Cases",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingDivision",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingSalesOffice",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingSalesOfficeCode",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CallType",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CaseCancel",
                table: "Cases",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CaseOrigin",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cause",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CloseReason",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CsRating",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Damage",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateTimeOpened",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionUpdate",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Direction",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DtAssigned",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DtInProgress",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DtResolved",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DtSupervisorApprove",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Emr",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InformantEmail",
                table: "Cases",
                type: "TEXT",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InformantName",
                table: "Cases",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InformantPosition",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Cases",
                type: "TEXT",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MilestoneStatus",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "NeedManPower",
                table: "Cases",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NotOtifMech",
                table: "Cases",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NotOtifMechReason",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NotOtifSol",
                table: "Cases",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NotOtifSolReason",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ObjectPart",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OmCompensation",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OtifMechStart",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtifMechStatus",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OtifMechTarget",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OtifSolStart",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtifSolStatus",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OtifSolTarget",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentCaseID",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Plant",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReasonBackdate",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReasonOthers",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SapStatus",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceArea",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SmrProblem",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SpecificObjectPart",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubcallType",
                table: "Cases",
                type: "TEXT",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TroubleDate",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaClosingUpdate",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaDescription",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaNumber",
                table: "Cases",
                type: "TEXT",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaUpdateProgress",
                table: "Cases",
                type: "TEXT",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Cases",
                keyColumn: "CaseID",
                keyValue: 1,
                columns: new[] { "ApprovalStatus", "BackdateMech", "BackdateSol", "BillingAccount", "BillingContactName", "BillingDivision", "BillingSalesOffice", "BillingSalesOfficeCode", "CallType", "CaseCancel", "CaseOrigin", "Cause", "CloseReason", "CsRating", "Damage", "DateTimeOpened", "DescriptionUpdate", "Direction", "DtAssigned", "DtInProgress", "DtResolved", "DtSupervisorApprove", "Emr", "InformantEmail", "InformantName", "InformantPosition", "Location", "MilestoneStatus", "NeedManPower", "NotOtifMech", "NotOtifMechReason", "NotOtifSol", "NotOtifSolReason", "ObjectPart", "OmCompensation", "OtifMechStart", "OtifMechStatus", "OtifMechTarget", "OtifSolStart", "OtifSolStatus", "OtifSolTarget", "ParentCaseID", "Plant", "ReasonBackdate", "ReasonOthers", "SapStatus", "ServiceArea", "SmrProblem", "SpecificObjectPart", "SubcallType", "TroubleDate", "WaClosingUpdate", "WaDescription", "WaNumber", "WaUpdateProgress" },
                values: new object[] { null, null, null, null, null, null, null, null, null, false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Open", false, false, null, false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Cases",
                keyColumn: "CaseID",
                keyValue: 2,
                columns: new[] { "ApprovalStatus", "BackdateMech", "BackdateSol", "BillingAccount", "BillingContactName", "BillingDivision", "BillingSalesOffice", "BillingSalesOfficeCode", "CallType", "CaseCancel", "CaseOrigin", "Cause", "CloseReason", "CsRating", "Damage", "DateTimeOpened", "DescriptionUpdate", "Direction", "DtAssigned", "DtInProgress", "DtResolved", "DtSupervisorApprove", "Emr", "InformantEmail", "InformantName", "InformantPosition", "Location", "MilestoneStatus", "NeedManPower", "NotOtifMech", "NotOtifMechReason", "NotOtifSol", "NotOtifSolReason", "ObjectPart", "OmCompensation", "OtifMechStart", "OtifMechStatus", "OtifMechTarget", "OtifSolStart", "OtifSolStatus", "OtifSolTarget", "ParentCaseID", "Plant", "ReasonBackdate", "ReasonOthers", "SapStatus", "ServiceArea", "SmrProblem", "SpecificObjectPart", "SubcallType", "TroubleDate", "WaClosingUpdate", "WaDescription", "WaNumber", "WaUpdateProgress" },
                values: new object[] { null, null, null, null, null, null, null, null, null, false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Open", false, false, null, false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Cases",
                keyColumn: "CaseID",
                keyValue: 3,
                columns: new[] { "ApprovalStatus", "BackdateMech", "BackdateSol", "BillingAccount", "BillingContactName", "BillingDivision", "BillingSalesOffice", "BillingSalesOfficeCode", "CallType", "CaseCancel", "CaseOrigin", "Cause", "CloseReason", "CsRating", "Damage", "DateTimeOpened", "DescriptionUpdate", "Direction", "DtAssigned", "DtInProgress", "DtResolved", "DtSupervisorApprove", "Emr", "InformantEmail", "InformantName", "InformantPosition", "Location", "MilestoneStatus", "NeedManPower", "NotOtifMech", "NotOtifMechReason", "NotOtifSol", "NotOtifSolReason", "ObjectPart", "OmCompensation", "OtifMechStart", "OtifMechStatus", "OtifMechTarget", "OtifSolStart", "OtifSolStatus", "OtifSolTarget", "ParentCaseID", "Plant", "ReasonBackdate", "ReasonOthers", "SapStatus", "ServiceArea", "SmrProblem", "SpecificObjectPart", "SubcallType", "TroubleDate", "WaClosingUpdate", "WaDescription", "WaNumber", "WaUpdateProgress" },
                values: new object[] { null, null, null, null, null, null, null, null, null, false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Open", false, false, null, false, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "BackdateMech",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "BackdateSol",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "BillingAccount",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "BillingContactName",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "BillingDivision",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "BillingSalesOffice",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "BillingSalesOfficeCode",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CallType",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CaseCancel",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CaseOrigin",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Cause",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CloseReason",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "CsRating",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Damage",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "DateTimeOpened",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "DescriptionUpdate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Direction",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "DtAssigned",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "DtInProgress",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "DtResolved",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "DtSupervisorApprove",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Emr",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "InformantEmail",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "InformantName",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "InformantPosition",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "MilestoneStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "NeedManPower",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "NotOtifMech",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "NotOtifMechReason",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "NotOtifSol",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "NotOtifSolReason",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ObjectPart",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OmCompensation",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OtifMechStart",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OtifMechStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OtifMechTarget",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OtifSolStart",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OtifSolStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "OtifSolTarget",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ParentCaseID",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "Plant",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ReasonBackdate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ReasonOthers",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SapStatus",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ServiceArea",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SmrProblem",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SpecificObjectPart",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "SubcallType",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "TroubleDate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "WaClosingUpdate",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "WaDescription",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "WaNumber",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "WaUpdateProgress",
                table: "Cases");
        }
    }
}
