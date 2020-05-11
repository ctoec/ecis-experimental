using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class CreateTimeSplitUtilization : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.CreateTable(
					name: "FundingTimeSplitUtilization",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("SqlServer:Identity", "1, 1"),
						ReportingPeriodId = table.Column<int>(nullable: false),
						ReportId = table.Column<int>(nullable: false),
						FundingSpaceId = table.Column<int>(nullable: false),
						FullTimeWeeksUsed = table.Column<int>(nullable: false),
						PartTimeWeeksUsed = table.Column<int>(nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_FundingTimeSplitUtilization", x => x.Id);
						table.ForeignKey(
											name: "FK_FundingTimeSplitUtilization_FundingSpace_FundingSpaceId",
											column: x => x.FundingSpaceId,
											principalTable: "FundingSpace",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
						table.ForeignKey(
											name: "FK_FundingTimeSplitUtilization_Report_ReportId",
											column: x => x.ReportId,
											principalTable: "Report",
											principalColumn: "Id",
											onDelete: ReferentialAction.Restrict);
						table.ForeignKey(
											name: "FK_FundingTimeSplitUtilization_ReportingPeriod_ReportingPeriodId",
											column: x => x.ReportingPeriodId,
											principalTable: "ReportingPeriod",
											principalColumn: "Id",
											onDelete: ReferentialAction.Restrict);
					});

			migrationBuilder.CreateIndex(
					name: "IX_FundingTimeSplitUtilization_FundingSpaceId",
					table: "FundingTimeSplitUtilization",
					column: "FundingSpaceId");

			migrationBuilder.CreateIndex(
					name: "IX_FundingTimeSplitUtilization_ReportId",
					table: "FundingTimeSplitUtilization",
					column: "ReportId");

			migrationBuilder.CreateIndex(
					name: "IX_FundingTimeSplitUtilization_ReportingPeriodId",
					table: "FundingTimeSplitUtilization",
					column: "ReportingPeriodId");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
					name: "FundingTimeSplitUtilization");
		}
	}
}
