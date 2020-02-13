using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
  public partial class BootstrapTestData : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.InsertData(
          table: "User",
          columns: new string[] { "FirstName", "LastName", "WingedKeysId" },
          values: new object[] { "Test", "User", "2c0ec653-8829-4aa1-82ba-37c8832bbb88" }
      );
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {

    }
  }
}
