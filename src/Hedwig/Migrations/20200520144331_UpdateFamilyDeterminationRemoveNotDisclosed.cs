using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
    public partial class UpdateFamilyDeterminationRemoveNotDisclosed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotDisclosed",
                table: "FamilyDetermination");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "NotDisclosed",
                table: "FamilyDetermination",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
