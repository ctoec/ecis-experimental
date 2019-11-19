using Microsoft.EntityFrameworkCore.Migrations;
using Hedwig.Models;

namespace hedwig.Migrations
{
    public partial class RemoveNullableGenderFromChild : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Child");

            migrationBuilder.AddColumn<int>(
                name: "Gender",
                table: "Child",
                nullable: false,
                defaultValue: Gender.Unspecified);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "Child",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
