using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class UpdateFundingSpaceTime : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<int>(
					name: "Time",
					table: "FundingSpace",
					nullable: true);

			migrationBuilder.AlterColumn<int>(
					name: "FundingSpaceId",
					table: "Funding",
					nullable: false,
					oldClrType: typeof(int),
					oldType: "int",
					oldNullable: true);

			migrationBuilder.CreateTable(
					name: "FundingTimeSplit",
					columns: table => new
					{
						Id = table.Column<int>(nullable: false)
									.Annotation("SqlServer:Identity", "1, 1"),
						FundingSpaceId = table.Column<int>(nullable: false),
						FullTimeWeeks = table.Column<int>(nullable: false),
						PartTimeWeeks = table.Column<int>(nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_FundingTimeSplit", x => x.Id);
						table.ForeignKey(
											name: "FK_FundingTimeSplit_FundingSpace_FundingSpaceId",
											column: x => x.FundingSpaceId,
											principalTable: "FundingSpace",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateIndex(
					name: "IX_FundingTimeSplit_FundingSpaceId",
					table: "FundingTimeSplit",
					column: "FundingSpaceId",
					unique: true);

			// Revert back to the original state where time exists directly on the FundingSpace
			// Now, we've added an additional FundingTime, Split, to indicate the split time 
			// allocation which will be captured in a separate FundingTimeSplit model.
			// Because no split fundings exist in prod right now, we can do a simple join
			// on FundingTimeAllocation (they will all be 1-to-1)
			migrationBuilder.Sql(@"
							UPDATE [FundingSpace]
							SET [Time] = [FundingTimeAllocation].[Time]
							FROM [FundingSpace]
							JOIN [FundingTimeAllocation]
							ON [FundingTimeAllocation].[FundingSpaceId] = [FundingSpace].[Id]
						");

			// Initially create this column as nullable, then populate, then make not nullable
			migrationBuilder.AlterColumn<int>(
					name: "Time",
					table: "FundingSpace",
					nullable: false,
					oldClrType: typeof(int),
					oldType: "int",
					oldNullable: true);

			// Drop old funding time allocation table
			migrationBuilder.DropTable(
					name: "FundingTimeAllocation");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropTable(
					name: "FundingTimeSplit");

			migrationBuilder.DropColumn(
					name: "Time",
					table: "FundingSpace");

			migrationBuilder.AlterColumn<int>(
					name: "FundingSpaceId",
					table: "Funding",
					type: "int",
					nullable: true,
					oldClrType: typeof(int));

			migrationBuilder.CreateTable(
					name: "FundingTimeAllocation",
					columns: table => new
					{
						Id = table.Column<int>(type: "int", nullable: false)
									.Annotation("SqlServer:Identity", "1, 1"),
						FundingSpaceId = table.Column<int>(type: "int", nullable: false),
						Time = table.Column<int>(type: "int", nullable: false),
						Weeks = table.Column<int>(type: "int", nullable: false)
					},
					constraints: table =>
					{
						table.PrimaryKey("PK_FundingTimeAllocation", x => x.Id);
						table.ForeignKey(
											name: "FK_FundingTimeAllocation_FundingSpace_FundingSpaceId",
											column: x => x.FundingSpaceId,
											principalTable: "FundingSpace",
											principalColumn: "Id",
											onDelete: ReferentialAction.Cascade);
					});

			migrationBuilder.CreateIndex(
					name: "IX_FundingTimeAllocation_FundingSpaceId",
					table: "FundingTimeAllocation",
					column: "FundingSpaceId");
		}
	}
}
