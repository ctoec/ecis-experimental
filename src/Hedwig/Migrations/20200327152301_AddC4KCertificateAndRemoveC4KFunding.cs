using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class AddC4KCertificateAndRemoveC4KFunding : Migration
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
						EndDate = table.Column<DateTime>(nullable: true)
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

			migrationBuilder.AddColumn<int>(
					name: "C4KFamilyCaseNumber",
					table: "Child",
					nullable: true);

			migrationBuilder.CreateIndex(
					name: "IX_C4KCertificate_ChildId",
					table: "C4KCertificate",
					column: "ChildId");

			migrationBuilder.Sql(@"
					INSERT INTO [C4KCertificate] ([ChildId], [StartDate], [EndDate])
							SELECT [Enrollment].[ChildId], [Funding].[CertificateStartDate], [Funding].[CertificateEndDate]
							FROM [Enrollment]
							LEFT JOIN [Funding]
							ON [Enrollment].[Id] = [Funding].[EnrollmentId]
							WHERE [Funding].[Source] = 1 /* C4K */;
			");

			migrationBuilder.Sql(@"
					UPDATE [Child]
					SET [Child].[C4KFamilyCaseNumber] = ProcessedFunding.[Id]
					FROM [Child]
					INNER JOIN (
							-- We are assuming all FamilyIds for a Child will be the same
							SELECT [Child].[Id] as ChildId, MAX([Funding].[FamilyId]) as Id
							FROM [Child]
							INNER JOIN [Enrollment]
							ON [Child].[Id] = [Enrollment].[ChildId]
							INNER JOIN [Funding]
							ON [Funding].[EnrollmentId] = [Enrollment].[Id]
							WHERE [Funding].[FamilyId] IS NOT NULL
							GROUP BY [Child].[Id]
					) ProcessedFunding
					ON ProcessedFunding.[ChildId] = [Child].[Id]
			");

			migrationBuilder.Sql(@"
					DELETE FROM [C4KCertificate]
					WHERE
					C4KCertificate.EndDate IS NULL AND 
					C4KCertificate.StartDate IS NULL
			");

			migrationBuilder.Sql(@"
						DELETE FROM [Funding]
						WHERE [Source] = 1 /* C4K */
					");

			migrationBuilder.DropColumn(
					name: "CertificateEndDate",
					table: "Funding");

			migrationBuilder.DropColumn(
					name: "CertificateStartDate",
					table: "Funding");

			migrationBuilder.DropColumn(
					name: "FamilyId",
					table: "Funding");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
					name: "C4KCertificate");

			migrationBuilder.DropColumn(
					name: "C4KFamilyCaseNumber",
					table: "Child");

			migrationBuilder.AddColumn<DateTime>(
					name: "CertificateEndDate",
					table: "Funding",
					type: "date",
					nullable: true);

			migrationBuilder.AddColumn<DateTime>(
					name: "CertificateStartDate",
					table: "Funding",
					type: "date",
					nullable: true);

			migrationBuilder.AddColumn<int>(
					name: "FamilyId",
					table: "Funding",
					type: "int",
					nullable: true);
		}
	}
}
