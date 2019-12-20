using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class UpdateFundingAddReportingPeriod : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Entry",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "Exit",
                table: "Funding");

            migrationBuilder.AlterColumn<int>(
                name: "Time",
                table: "Funding",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "CertificateEndDate",
                table: "Funding",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CertificateStartDate",
                table: "Funding",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FirstReportingPeriodId",
                table: "Funding",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LastReportingPeriodId",
                table: "Funding",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Funding_FirstReportingPeriodId",
                table: "Funding",
                column: "FirstReportingPeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_Funding_LastReportingPeriodId",
                table: "Funding",
                column: "LastReportingPeriodId");

            migrationBuilder.AddForeignKey(
                name: "FK_Funding_ReportingPeriod_FirstReportingPeriodId",
                table: "Funding",
                column: "FirstReportingPeriodId",
                principalTable: "ReportingPeriod",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Funding_ReportingPeriod_LastReportingPeriodId",
                table: "Funding",
                column: "LastReportingPeriodId",
                principalTable: "ReportingPeriod",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Funding_ReportingPeriod_FirstReportingPeriodId",
                table: "Funding");

            migrationBuilder.DropForeignKey(
                name: "FK_Funding_ReportingPeriod_LastReportingPeriodId",
                table: "Funding");

            migrationBuilder.DropIndex(
                name: "IX_Funding_FirstReportingPeriodId",
                table: "Funding");

            migrationBuilder.DropIndex(
                name: "IX_Funding_LastReportingPeriodId",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "CertificateEndDate",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "CertificateStartDate",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "FirstReportingPeriodId",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "LastReportingPeriodId",
                table: "Funding");

            migrationBuilder.AlterColumn<int>(
                name: "Time",
                table: "Funding",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Entry",
                table: "Funding",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Exit",
                table: "Funding",
                type: "datetime2",
                nullable: true);
        }
    }
}
