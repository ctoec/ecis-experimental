using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class UpdateFundingAddFundingSpace : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.AddColumn<int>(
					name: "FundingSpaceId",
					table: "Funding",
					nullable: true);

			migrationBuilder.CreateIndex(
					name: "IX_Funding_FundingSpaceId",
					table: "Funding",
					column: "FundingSpaceId");

			migrationBuilder.AddForeignKey(
					name: "FK_Funding_FundingSpace_FundingSpaceId",
					table: "Funding",
					column: "FundingSpaceId",
					principalTable: "FundingSpace",
					principalColumn: "Id",
					onDelete: ReferentialAction.Restrict);

			migrationBuilder.Sql(@"
				UPDATE [Funding]
				SET [FundingSpaceId] = [FundingSpace].[Id]
				FROM [Funding]
				JOIN [Enrollment]
					ON [Enrollment].[Id] = [Funding].[EnrollmentId]
				JOIN [Site]
					ON [Site].[Id] = [Enrollment].[SiteId]
				JOIN [Organization]
					ON [Organization].[Id] = [Site].[OrganizationId]  
				JOIN [FundingSpace]
					ON [FundingSpace].[OrganizationId] = [Organization].[Id]
					AND [FundingSpace].[AgeGroup] = [Enrollment].[AgeGroup]
					AND [FundingSpace].[Time] = [Funding].[Time]
			");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.DropForeignKey(
					name: "FK_Funding_FundingSpace_FundingSpaceId",
					table: "Funding");

			migrationBuilder.DropIndex(
					name: "IX_Funding_FundingSpaceId",
					table: "Funding");

			migrationBuilder.DropColumn(
					name: "FundingSpaceId",
					table: "Funding");
		}
	}
}
