using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddOrganizations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SitePermission_Site_SiteId",
                table: "SitePermission");

            migrationBuilder.DropForeignKey(
                name: "FK_SitePermission_User_UserId",
                table: "SitePermission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SitePermission",
                table: "SitePermission");

            migrationBuilder.RenameTable(
                name: "SitePermission",
                newName: "Permissions");

            migrationBuilder.RenameIndex(
                name: "IX_SitePermission_UserId",
                table: "Permissions",
                newName: "IX_Permissions_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SitePermission_SiteId",
                table: "Permissions",
                newName: "IX_Permissions_SiteId");

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "Site",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "Permissions",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "Permissions",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Permissions",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Organization",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organization", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Site_OrganizationId",
                table: "Site",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_OrganizationId",
                table: "Permissions",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_Organization_OrganizationId",
                table: "Permissions",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_User_UserId",
                table: "Permissions",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Permissions_Site_SiteId",
                table: "Permissions",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Site_Organization_OrganizationId",
                table: "Site",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_Organization_OrganizationId",
                table: "Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_User_UserId",
                table: "Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Permissions_Site_SiteId",
                table: "Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Site_Organization_OrganizationId",
                table: "Site");

            migrationBuilder.DropTable(
                name: "Organization");

            migrationBuilder.DropIndex(
                name: "IX_Site_OrganizationId",
                table: "Site");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Permissions",
                table: "Permissions");

            migrationBuilder.DropIndex(
                name: "IX_Permissions_OrganizationId",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Site");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Permissions");

            migrationBuilder.RenameTable(
                name: "Permissions",
                newName: "SitePermission");

            migrationBuilder.RenameIndex(
                name: "IX_Permissions_SiteId",
                table: "SitePermission",
                newName: "IX_SitePermission_SiteId");

            migrationBuilder.RenameIndex(
                name: "IX_Permissions_UserId",
                table: "SitePermission",
                newName: "IX_SitePermission_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "SiteId",
                table: "SitePermission",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SitePermission",
                table: "SitePermission",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SitePermission_Site_SiteId",
                table: "SitePermission",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SitePermission_User_UserId",
                table: "SitePermission",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
