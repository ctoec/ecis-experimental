using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
	public partial class DeleteC4kFundings : Migration
	{
		protected override void Up(MigrationBuilder migrationBuilder)
		{
			migrationBuilder.Sql(@"
						DELETE FROM [Funding]
						WHERE [Source] = 1 /* C4K */
					");
		}

		protected override void Down(MigrationBuilder migrationBuilder)
		{

		}
	}
}
