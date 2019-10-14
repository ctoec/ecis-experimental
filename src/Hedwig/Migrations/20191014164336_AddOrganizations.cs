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
                newName: "SitePermissions");

            migrationBuilder.RenameIndex(
                name: "IX_SitePermission_UserId",
                table: "SitePermissions",
                newName: "IX_SitePermissions_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SitePermission_SiteId",
                table: "SitePermissions",
                newName: "IX_SitePermissions_SiteId");

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "Site",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SitePermissions",
                table: "SitePermissions",
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

            migrationBuilder.CreateTable(
                name: "OrganizationPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrganizationPermissions_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrganizationPermissions_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Site_OrganizationId",
                table: "Site",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationPermissions_OrganizationId",
                table: "OrganizationPermissions",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationPermissions_UserId",
                table: "OrganizationPermissions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Site_Organization_OrganizationId",
                table: "Site",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SitePermissions_Site_SiteId",
                table: "SitePermissions",
                column: "SiteId",
                principalTable: "Site",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SitePermissions_User_UserId",
                table: "SitePermissions",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Site_Organization_OrganizationId",
                table: "Site");

            migrationBuilder.DropForeignKey(
                name: "FK_SitePermissions_Site_SiteId",
                table: "SitePermissions");

            migrationBuilder.DropForeignKey(
                name: "FK_SitePermissions_User_UserId",
                table: "SitePermissions");

            migrationBuilder.DropTable(
                name: "OrganizationPermissions");

            migrationBuilder.DropTable(
                name: "Organization");

            migrationBuilder.DropIndex(
                name: "IX_Site_OrganizationId",
                table: "Site");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SitePermissions",
                table: "SitePermissions");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Site");

            migrationBuilder.RenameTable(
                name: "SitePermissions",
                newName: "SitePermission");

            migrationBuilder.RenameIndex(
                name: "IX_SitePermissions_UserId",
                table: "SitePermission",
                newName: "IX_SitePermission_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_SitePermissions_SiteId",
                table: "SitePermission",
                newName: "IX_SitePermission_SiteId");

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
