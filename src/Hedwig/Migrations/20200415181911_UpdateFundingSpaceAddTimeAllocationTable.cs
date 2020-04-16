using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class UpdateFundingSpaceAddTimeAllocationTable : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{

			migrationBuilder.CreateTable(
					name: "FundingTimeAllocation",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("SqlServer:Identity", "1, 1"),
						FundingSpaceId = table.Column<int>(nullable: false),
						Weeks = table.Column<int>(nullable: false),
						Time = table.Column<int>(nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_FundingTimeAllocation", x => x.Id);
						table.ForeignKey(
											name: "FK_FundingTimeAllocation_FundingSpace_FundingSpaceId",
											column: x => x.FundingSpaceId,
											principalTable: "FundingSpace",
											principalColumn: "Id",
											onDelete: ReferentialAction.Restrict);
					});

			migrationBuilder.CreateIndex(
					name: "IX_FundingTimeAllocation_FundingSpaceId",
					table: "FundingTimeAllocation",
					column: "FundingSpaceId");


			migrationBuilder.Sql(@"
                INSERT INTO [FundingTimeAllocation] (FundingSpaceId, Time, Weeks)
                SELECT 
                    Id, 
                    CASE 
                        WHEN [FundingTimeAllocations] LIKE '%Full%' THEN 0 
                        WHEN [FundingTimeAllocations] LIKE '%Part%' THEN 1 
                    END, 
                    52 -- All existing funding spaces are for a full year
                FROM [FundingSpace];
            ");

			migrationBuilder.DropColumn(
					name: "FundingTimeAllocations",
					table: "FundingSpace");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
					name: "FundingTimeAllocation");

			migrationBuilder.AddColumn<string>(
					name: "FundingTimeAllocations",
					table: "FundingSpace",
					type: "nvarchar(max)",
					nullable: true);
		}
	}
}
