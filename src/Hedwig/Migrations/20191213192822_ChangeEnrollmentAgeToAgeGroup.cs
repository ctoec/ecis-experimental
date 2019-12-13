using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class ChangeEnrollmentAgeToAgeGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "Enrollment");
            migrationBuilder.AddColumn<int>(
                name: "AgeGroup",
                table: "Enrollment",
                nullable: true);

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgeGroup",
                table: "Enrollment");
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Enrollment",
                nullable: true);
        }
    }
}
