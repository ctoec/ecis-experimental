using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class UpdateFundingAddTimeCreateFundingTimeSplit : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			/* Make Funding.FundingSpaceId not null */
			// Temporarily turn off system versioning to
			// fixup funding history table (to enable updating funding column to not null)
			migrationBuilder.Sql(@"
							ALTER TABLE [Funding]
								SET (SYSTEM_VERSIONING = OFF)
						");
			migrationBuilder.Sql(@"
							UPDATE [History].[Funding]
								SET [FundingSpaceId] = 0
							WHERE [FundingSpaceId] IS NULL

							ALTER TABLE [History].[Funding]
								ALTER COLUMN [FundingSpaceId] INT NOT NULL
						");

			migrationBuilder.AlterColumn<int>(
					name: "FundingSpaceId",
					table: "Funding",
					nullable: false,
					oldClrType: typeof(int),
					oldType: "int",
					oldNullable: true);

			migrationBuilder.Sql(@"
							ALTER TABLE [Funding]
								SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [History].[Funding]))
						");

			/* Revert from FundingSpace with many FundingTimeAllocations to
				 FundingSpace with one Time, and zero or one FundingTimeSplit
				 (required if Time = Split) */
			migrationBuilder.AddColumn<int>(
					name: "Time",
					table: "FundingSpace",
					nullable: true);

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

			// Set FundingSpace.Time from FundingTimeAllocation records.
			// Becasue no split time funding spaces exist in prod right now,
			// all FundingSpace-FundingTimeAllocations are one-to-one, so a
			// simple join with suffice
			migrationBuilder.Sql(@"
							UPDATE [FundingSpace]
							SET [Time] = [FundingTimeAllocation].[Time]
							FROM [FundingSpace]
							JOIN [FundingTimeAllocation]
							ON [FundingTimeAllocation].[FundingSpaceId] = [FundingSpace].[Id]
						");

			migrationBuilder.AlterColumn<int>(
				name: "Time",
				table: "FundingSpace",
				nullable: false,
				oldNullable: true
			);

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
