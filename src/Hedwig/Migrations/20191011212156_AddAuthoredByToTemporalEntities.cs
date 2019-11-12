using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddAuthoredByToTemporalEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Funding",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "FamilyDetermination",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Family",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Enrollment",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Child",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "FamilyDetermination");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Enrollment");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Child");
        }
    }
}
