using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class UpdateFundingRemoveEntryExitAddTime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Entry",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "Exit",
                table: "Funding");

            migrationBuilder.AddColumn<int>(
                name: "Time",
                table: "Funding",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Time",
                table: "Funding");

            migrationBuilder.AddColumn<DateTime>(
                name: "Entry",
                table: "Funding",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Exit",
                table: "Funding",
                nullable: true);
        }
    }
}
