using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class UpdateFundingSpaceRemoveTime : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropColumn(
					name: "Time",
					table: "FundingSpace");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<int>(
					name: "Time",
					table: "FundingSpace",
					type: "int",
					nullable: false,
					defaultValue: 0);
		}
	}
}
