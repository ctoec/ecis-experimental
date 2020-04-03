using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class UpdateFundingSpaceAddFundingTimeAllocations : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<string>(
					name: "FundingTimeAllocations",
					table: "FundingSpace",
					nullable: true);

			// All existing FundingSpaces have single full-year (52 week) funding time allocations
			migrationBuilder.Sql(@"
							UPDATE [FundingSpace]
							SET [FundingTimeAllocations] = CASE 
								WHEN [Time] = 0 /* Full */ 
									THEN '[{""Time"":""Full"",""Weeks"":52}]'
								WHEN [Time] = 1 /* Part */
									THEN '[{""Time"":""Part"",""Weeks"":52}]'
							END
						");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
					name: "FundingTimeAllocations",
					table: "FundingSpace");
		}
	}
}
