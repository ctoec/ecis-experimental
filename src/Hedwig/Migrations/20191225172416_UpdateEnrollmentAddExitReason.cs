using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class UpdateEnrollmentAddExitReason : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExitReason",
                table: "Enrollment",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExitReason",
                table: "Enrollment");
        }
    }
}
