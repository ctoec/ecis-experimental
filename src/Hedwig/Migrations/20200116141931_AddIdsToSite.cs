using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class AddIdsToSite : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(
				name: "FK_Funding_Enrollment_EnrollmentId",
				table: "Funding");

			migrationBuilder.AddColumn<int>(
				name: "FacilityCode",
				table: "Site",
				nullable: true);

			migrationBuilder.AddColumn<int>(
				name: "LicenseNumber",
				table: "Site",
				nullable: true);

			migrationBuilder.AddColumn<int>(
				name: "NaeycId",
				table: "Site",
				nullable: true);

			migrationBuilder.AddColumn<int>(
				name: "RegistryId",
				table: "Site",
				nullable: true);

			migrationBuilder.AddForeignKey(
				name: "FK_Funding_Enrollment_EnrollmentId",
				table: "Funding",
				column: "EnrollmentId",
				principalTable: "Enrollment",
				principalColumn: "Id",
				onDelete: ReferentialAction.Cascade);
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(
				name: "FK_Funding_Enrollment_EnrollmentId",
				table: "Funding");

			migrationBuilder.DropColumn(
				name: "FacilityCode",
				table: "Site");

			migrationBuilder.DropColumn(
				name: "LicenseNumber",
				table: "Site");

			migrationBuilder.DropColumn(
				name: "NaeycId",
				table: "Site");

			migrationBuilder.DropColumn(
				name: "RegistryId",
				table: "Site");

			migrationBuilder.AddForeignKey(
				name: "FK_Funding_Enrollment_EnrollmentId",
				table: "Funding",
				column: "EnrollmentId",
				principalTable: "Enrollment",
				principalColumn: "Id",
				onDelete: ReferentialAction.Restrict);
		}
	}
}
