using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddNotProvidedToDetermination : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "NotDisclosed",
                table: "FamilyDetermination",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotDisclosed",
                table: "FamilyDetermination");
        }
    }
}
