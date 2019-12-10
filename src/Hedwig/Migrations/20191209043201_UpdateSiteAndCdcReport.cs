using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class UpdateSiteAndCdcReport : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Region",
                table: "Site",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "TitleI",
                table: "Site",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "C4KRevenue",
                table: "Report",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FamilyFeesRevenue",
                table: "Report",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RetroactiveC4KRevenue",
                table: "Report",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Region",
                table: "Site");

            migrationBuilder.DropColumn(
                name: "TitleI",
                table: "Site");

            migrationBuilder.DropColumn(
                name: "C4KRevenue",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "FamilyFeesRevenue",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "RetroactiveC4KRevenue",
                table: "Report");
        }
    }
}
