using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class AddC4KCertificateModel : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
					name: "C4KCertificate",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("SqlServer:Identity", "1, 1"),
						ChildId = table.Column<Guid>(nullable: false),
						StartDate = table.Column<DateTime>(nullable: true),
						EndDate = table.Column<DateTime>(nullable: true),
						FamilyCertificateId = table.Column<int>(nullable: true)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_C4KCertificate", x => x.Id);
						table.ForeignKey(
											name: "FK_C4KCertificate_Child_ChildId",
											column: x => x.ChildId,
											principalTable: "Child",
											principalColumn: "Id",
											onDelete: ReferentialAction.Restrict);
					});

			migrationBuilder.CreateIndex(
					name: "IX_C4KCertificate_ChildId",
					table: "C4KCertificate",
					column: "ChildId");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
					name: "C4KCertificate");
		}
	}
}
