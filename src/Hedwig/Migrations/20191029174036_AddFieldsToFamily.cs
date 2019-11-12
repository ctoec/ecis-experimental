using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddFieldsToFamily : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AddressLine1",
                table: "Family",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "Family",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Homelessness",
                table: "Family",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Family",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Town",
                table: "Family",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Zip",
                table: "Family",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressLine1",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "Homelessness",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "Town",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "Zip",
                table: "Family");
        }
    }
}
