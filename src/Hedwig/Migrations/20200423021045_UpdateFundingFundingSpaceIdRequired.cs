using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
    public partial class UpdateFundingFundingSpaceIdRequired : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "FundingSpaceId",
                table: "Funding",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "FundingSpaceId",
                table: "Funding",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));
        }
    }
}
