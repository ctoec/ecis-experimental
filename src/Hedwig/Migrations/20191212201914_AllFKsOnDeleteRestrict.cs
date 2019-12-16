using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AllFKsOnDeleteRestrict : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enrollment_Child_ChildId",
                table: "Enrollment");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollment_Site_SiteId",
                table: "Enrollment");

            migrationBuilder.DropForeignKey(
                name: "FK_FamilyDetermination_Family_FamilyId",
                table: "FamilyDetermination");

            migrationBuilder.DropForeignKey(
                name: "FK_Funding_Enrollment_EnrollmentId",
                table: "Funding");

            migrationBuilder.DropForeignKey(
                name: "FK_FundingSpace_Organization_OrganizationId",
                table: "FundingSpace");

            migrationBuilder.DropForeignKey(
                name: "FK_Permission_Organization_OrganizationId",
                table: "Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_Permission_Site_SiteId",
                table: "Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_Report_Organization_OrganizationId",
                table: "Report");

            migrationBuilder.DropForeignKey(
                name: "FK_Report_ReportingPeriod_ReportingPeriodId",
                table: "Report");

            migrationBuilder.AlterColumn<int>(
                name: "OrganizationId",
                table: "Child",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FamilyId",
                table: "Child",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollment_Child_ChildId",
                table: "Enrollment",
                column: "ChildId",
                principalTable: "Child",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollment_Site_SiteId",
                table: "Enrollment",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyDetermination_Family_FamilyId",
                table: "FamilyDetermination",
                column: "FamilyId",
                principalTable: "Family",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Funding_Enrollment_EnrollmentId",
                table: "Funding",
                column: "EnrollmentId",
                principalTable: "Enrollment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FundingSpace_Organization_OrganizationId",
                table: "FundingSpace",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_Organization_OrganizationId",
                table: "Permission",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_Site_SiteId",
                table: "Permission",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Organization_OrganizationId",
                table: "Report",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Report_ReportingPeriod_ReportingPeriodId",
                table: "Report",
                column: "ReportingPeriodId",
                principalTable: "ReportingPeriod",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enrollment_Child_ChildId",
                table: "Enrollment");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollment_Site_SiteId",
                table: "Enrollment");

            migrationBuilder.DropForeignKey(
                name: "FK_FamilyDetermination_Family_FamilyId",
                table: "FamilyDetermination");

            migrationBuilder.DropForeignKey(
                name: "FK_Funding_Enrollment_EnrollmentId",
                table: "Funding");

            migrationBuilder.DropForeignKey(
                name: "FK_FundingSpace_Organization_OrganizationId",
                table: "FundingSpace");

            migrationBuilder.DropForeignKey(
                name: "FK_Permission_Organization_OrganizationId",
                table: "Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_Permission_Site_SiteId",
                table: "Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_Report_Organization_OrganizationId",
                table: "Report");

            migrationBuilder.DropForeignKey(
                name: "FK_Report_ReportingPeriod_ReportingPeriodId",
                table: "Report");

            migrationBuilder.AlterColumn<int>(
                name: "OrganizationId",
                table: "Child",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "FamilyId",
                table: "Child",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollment_Child_ChildId",
                table: "Enrollment",
                column: "ChildId",
                principalTable: "Child",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollment_Site_SiteId",
                table: "Enrollment",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyDetermination_Family_FamilyId",
                table: "FamilyDetermination",
                column: "FamilyId",
                principalTable: "Family",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Funding_Enrollment_EnrollmentId",
                table: "Funding",
                column: "EnrollmentId",
                principalTable: "Enrollment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FundingSpace_Organization_OrganizationId",
                table: "FundingSpace",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_Organization_OrganizationId",
                table: "Permission",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_Site_SiteId",
                table: "Permission",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Organization_OrganizationId",
                table: "Report",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Report_ReportingPeriod_ReportingPeriodId",
                table: "Report",
                column: "ReportingPeriodId",
                principalTable: "ReportingPeriod",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
