using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class AddUpdatedAtToTemporalEntities : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<DateTime>(
				name: "UpdatedAt",
				table: "Funding",
				nullable: true);

			migrationBuilder.AddColumn<DateTime>(
				name: "UpdatedAt",
				table: "FamilyDetermination",
				nullable: true);

			migrationBuilder.AddColumn<DateTime>(
				name: "UpdatedAt",
				table: "Family",
				nullable: true);

			migrationBuilder.AddColumn<DateTime>(
				name: "UpdatedAt",
				table: "Enrollment",
				nullable: true);

			migrationBuilder.AddColumn<DateTime>(
				name: "UpdatedAt",
				table: "Child",
				nullable: true);
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
				name: "UpdatedAt",
				table: "Funding");

			migrationBuilder.DropColumn(
				name: "UpdatedAt",
				table: "FamilyDetermination");

			migrationBuilder.DropColumn(
				name: "UpdatedAt",
				table: "Family");

			migrationBuilder.DropColumn(
				name: "UpdatedAt",
				table: "Enrollment");

			migrationBuilder.DropColumn(
				name: "UpdatedAt",
				table: "Child");
		}
	}
}
