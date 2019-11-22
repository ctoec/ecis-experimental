using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddOrganizationIdToChild : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "Child",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Child_OrganizationId",
                table: "Child",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Child_Organization_OrganizationId",
                table: "Child",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Child_Organization_OrganizationId",
                table: "Child");

            migrationBuilder.DropIndex(
                name: "IX_Child_OrganizationId",
                table: "Child");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Child");
        }
    }
}
