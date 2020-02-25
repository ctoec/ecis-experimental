using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class ConvertDateTimeToDate : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<DateTime>(
				name: "PeriodStart",
				table: "ReportingPeriod",
				type: "date",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "datetime2");

			migrationBuilder.AlterColumn<DateTime>(
				name: "PeriodEnd",
				table: "ReportingPeriod",
				type: "date",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "datetime2");

			migrationBuilder.AlterColumn<DateTime>(
				name: "Period",
				table: "ReportingPeriod",
				type: "date",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "datetime2");

			migrationBuilder.AlterColumn<DateTime>(
				name: "DueAt",
				table: "ReportingPeriod",
				type: "date",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "datetime2");

			migrationBuilder.AlterColumn<DateTime>(
				name: "CertificateStartDate",
				table: "Funding",
				type: "date",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "datetime2",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "CertificateEndDate",
				table: "Funding",
				type: "date",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "datetime2",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "DeterminationDate",
				table: "FamilyDetermination",
				type: "date",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "datetime2",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "Exit",
				table: "Enrollment",
				type: "date",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "datetime2",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "Entry",
				table: "Enrollment",
				type: "date",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "datetime2",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "Birthdate",
				table: "Child",
				type: "date",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "datetime2",
				oldNullable: true);
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AlterColumn<DateTime>(
				name: "PeriodStart",
				table: "ReportingPeriod",
				type: "datetime2",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "date");

			migrationBuilder.AlterColumn<DateTime>(
				name: "PeriodEnd",
				table: "ReportingPeriod",
				type: "datetime2",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "date");

			migrationBuilder.AlterColumn<DateTime>(
				name: "Period",
				table: "ReportingPeriod",
				type: "datetime2",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "date");

			migrationBuilder.AlterColumn<DateTime>(
				name: "DueAt",
				table: "ReportingPeriod",
				type: "datetime2",
				nullable: false,
				oldClrType: typeof(DateTime),
				oldType: "date");

			migrationBuilder.AlterColumn<DateTime>(
				name: "CertificateStartDate",
				table: "Funding",
				type: "datetime2",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "date",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "CertificateEndDate",
				table: "Funding",
				type: "datetime2",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "date",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "DeterminationDate",
				table: "FamilyDetermination",
				type: "datetime2",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "date",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "Exit",
				table: "Enrollment",
				type: "datetime2",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "date",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "Entry",
				table: "Enrollment",
				type: "datetime2",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "date",
				oldNullable: true);

			migrationBuilder.AlterColumn<DateTime>(
				name: "Birthdate",
				table: "Child",
				type: "datetime2",
				nullable: true,
				oldClrType: typeof(DateTime),
				oldType: "date",
				oldNullable: true);
		}
	}
}
