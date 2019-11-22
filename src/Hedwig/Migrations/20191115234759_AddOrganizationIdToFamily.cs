using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddOrganizationIdToFamily : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "Family",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Family_OrganizationId",
                table: "Family",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Family_Organization_OrganizationId",
                table: "Family",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Family_Organization_OrganizationId",
                table: "Family");

            migrationBuilder.DropIndex(
                name: "IX_Family_OrganizationId",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Family");
        }
    }
}
