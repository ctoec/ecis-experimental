using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
  public partial class ChangeFundingSourceToNullableInFunding : Migration
  {
	protected override void Up(MigrationBuilder migrationBuilder)
	{
	  migrationBuilder.AlterColumn<int>(
		  name: "Source",
		  table: "Funding",
		  nullable: true,
		  oldClrType: typeof(int),
		  oldType: "int");
	}

	protected override void Down(MigrationBuilder migrationBuilder)
	{
	  migrationBuilder.AlterColumn<int>(
		  name: "Source",
		  table: "Funding",
		  type: "int",
		  nullable: false,
		  oldClrType: typeof(int),
		  oldNullable: true);
	}
  }
}
