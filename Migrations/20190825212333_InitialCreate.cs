using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class InitialCreate : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
					name: "Family",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("Sqlite:Autoincrement", true)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_Family", x => x.Id);
					});

			migrationBuilder.CreateTable(
					name: "Site",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("Sqlite:Autoincrement", true),
						Name = table.Column<string>(maxLength: 100, nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_Site", x => x.Id);
					});

			migrationBuilder.CreateTable(
					name: "User",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("Sqlite:Autoincrement", true),
						FirstName = table.Column<string>(maxLength: 35, nullable: false),
						MiddleName = table.Column<string>(maxLength: 35, nullable: true),
						LastName = table.Column<string>(maxLength: 35, nullable: false),
						Suffix = table.Column<string>(maxLength: 10, nullable: true)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_User", x => x.Id);
					});

			migrationBuilder.CreateTable(
					name: "Child",
					columns: table => new
					{
						Id = table.Column<Guid>(nullable: false),
						FirstName = table.Column<string>(maxLength: 35, nullable: false),
						MiddleName = table.Column<string>(maxLength: 35, nullable: true),
						LastName = table.Column<string>(maxLength: 35, nullable: false),
						Suffix = table.Column<string>(maxLength: 10, nullable: true),
						Birthdate = table.Column<DateTime>(nullable: false),
						Gender = table.Column<int>(nullable: false),
						AmericanIndianOrAlaskaNative = table.Column<bool>(nullable: true),
						Asian = table.Column<bool>(nullable: true),
						BlackOrAfricanAmerican = table.Column<bool>(nullable: true),
						NativeHawaiianOrPacificIslander = table.Column<bool>(nullable: true),
						White = table.Column<bool>(nullable: true),
						HispanicOrLatinxEthnicity = table.Column<bool>(nullable: true),
						FamilyId = table.Column<int>(nullable: true)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_Child", x => x.Id);
						table.ForeignKey(
											name: "FK_Child_Family_FamilyId",
											column: x => x.FamilyId,
											principalTable: "Family",
											principalColumn: "Id",
											onDelete: ReferentialAction.Restrict);
					});

			migrationBuilder.CreateTable(
					name: "FamilyDetermination",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("Sqlite:Autoincrement", true),
						NumberOfPeople = table.Column<int>(nullable: false),
						Income = table.Column<decimal>(nullable: false),
						Determined = table.Column<DateTime>(nullable: false),
						FamilyId = table.Column<int>(nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_FamilyDetermination", x => x.Id);
						table.ForeignKey(
											name: "FK_FamilyDetermination_Family_FamilyId",
											column: x => x.FamilyId,
											principalTable: "Family",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateTable(
					name: "SitePermission",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("Sqlite:Autoincrement", true),
						UserId = table.Column<int>(nullable: false),
						SiteId = table.Column<int>(nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_SitePermission", x => x.Id);
						table.ForeignKey(
											name: "FK_SitePermission_Site_SiteId",
											column: x => x.SiteId,
											principalTable: "Site",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
						table.ForeignKey(
											name: "FK_SitePermission_User_UserId",
											column: x => x.UserId,
											principalTable: "User",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateTable(
					name: "Enrollment",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("Sqlite:Autoincrement", true),
						ChildId = table.Column<Guid>(nullable: false),
						SiteId = table.Column<int>(nullable: false),
						Entry = table.Column<DateTime>(nullable: false),
						Exit = table.Column<DateTime>(nullable: true)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_Enrollment", x => x.Id);
						table.ForeignKey(
											name: "FK_Enrollment_Child_ChildId",
											column: x => x.ChildId,
											principalTable: "Child",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
						table.ForeignKey(
											name: "FK_Enrollment_Site_SiteId",
											column: x => x.SiteId,
											principalTable: "Site",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateTable(
					name: "Funding",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("Sqlite:Autoincrement", true),
						EnrollmentId = table.Column<int>(nullable: false),
						Source = table.Column<int>(nullable: false),
						Entry = table.Column<DateTime>(nullable: false),
						Exit = table.Column<DateTime>(nullable: true)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_Funding", x => x.Id);
						table.ForeignKey(
											name: "FK_Funding_Enrollment_EnrollmentId",
											column: x => x.EnrollmentId,
											principalTable: "Enrollment",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateIndex(
					name: "IX_Child_FamilyId",
					table: "Child",
					column: "FamilyId");

			migrationBuilder.CreateIndex(
					name: "IX_Enrollment_ChildId",
					table: "Enrollment",
					column: "ChildId");

			migrationBuilder.CreateIndex(
					name: "IX_Enrollment_SiteId",
					table: "Enrollment",
					column: "SiteId");

			migrationBuilder.CreateIndex(
					name: "IX_FamilyDetermination_FamilyId",
					table: "FamilyDetermination",
					column: "FamilyId");

			migrationBuilder.CreateIndex(
					name: "IX_Funding_EnrollmentId",
					table: "Funding",
					column: "EnrollmentId");

			migrationBuilder.CreateIndex(
					name: "IX_SitePermission_SiteId",
					table: "SitePermission",
					column: "SiteId");

			migrationBuilder.CreateIndex(
					name: "IX_SitePermission_UserId",
					table: "SitePermission",
					column: "UserId");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
					name: "FamilyDetermination");

			migrationBuilder.DropTable(
					name: "Funding");

			migrationBuilder.DropTable(
					name: "SitePermission");

			migrationBuilder.DropTable(
					name: "Enrollment");

			migrationBuilder.DropTable(
					name: "User");

			migrationBuilder.DropTable(
					name: "Child");

			migrationBuilder.DropTable(
					name: "Site");

			migrationBuilder.DropTable(
					name: "Family");
		}
	}
}
