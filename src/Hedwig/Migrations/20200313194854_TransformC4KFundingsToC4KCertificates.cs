using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class TransformC4KFundingsToC4KCertificates : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.Sql(@"
                INSERT INTO [C4KCertificate] ([ChildId], [FamilyCertificateId], [StartDate], [EndDate])
                    SELECT [Enrollment].[ChildId], [Funding].[FamilyId], [Funding].[CertificateStartDate], [Funding].[CertificateEndDate]
                    FROM [Enrollment]
                    LEFT JOIN [Funding]
                    ON [Enrollment].[Id] = [Funding].[EnrollmentId]
                    WHERE [Funding].[Source] = 1 /* C4K */;
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
			migrationBuilder.DropColumn(
					name: "EndDate",
					table: "C4KCertificate");

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
