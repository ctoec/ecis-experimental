using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class UpdateFundingSpaceMakeFundingTimeAllocationFKDelete : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(
					name: "FK_FundingTimeAllocation_FundingSpace_FundingSpaceId",
					table: "FundingTimeAllocation");

			migrationBuilder.AddForeignKey(
					name: "FK_FundingTimeAllocation_FundingSpace_FundingSpaceId",
					table: "FundingTimeAllocation",
					column: "FundingSpaceId",
					principalTable: "FundingSpace",
					principalColumn: "Id",
					onDelete: ReferentialAction.Cascade);
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(
					name: "FK_FundingTimeAllocation_FundingSpace_FundingSpaceId",
					table: "FundingTimeAllocation");

			migrationBuilder.AddForeignKey(
					name: "FK_FundingTimeAllocation_FundingSpace_FundingSpaceId",
					table: "FundingTimeAllocation",
					column: "FundingSpaceId",
					principalTable: "FundingSpace",
					principalColumn: "Id",
					onDelete: ReferentialAction.Restrict);
		}
	}
}
