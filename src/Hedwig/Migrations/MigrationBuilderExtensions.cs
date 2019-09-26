using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
    public static class MigrationBuilderExtensions
    {
        private const string HISTORY_TABLE_SCHEMA = "History";

        public static void CreateHistorySchema(
            this MigrationBuilder migrationBuilder
        )
        {
            migrationBuilder.Sql($"CREATE SCHEMA {HISTORY_TABLE_SCHEMA}");

        }
        //  See https://docs.microsoft.com/en-us/sql/relational-databases/tables/creating-a-system-versioned-temporal-table?view=sql-server-2017#adding-versioning-to-non-temporal-tables
        public static void AddTemporalTableSupport(this MigrationBuilder migrationBuilder, string tableName)
        {
            migrationBuilder.Sql($@"
                ALTER TABLE {tableName} ADD
                    SysStartTime DATETIME2(0) GENERATED ALWAYS AS ROW START HIDDEN
                        CONSTRAINT DF_SysStart DEFAULT SYSUTCDATETIME(),
                    SysEndTime DATETIME2(0) GENERATED ALWAYS AS ROW END HIDDEN
                        CONSTRAINT DF_SysEnd DEFAULT CONVERT(DATETIME2 (0), '9999-12-31 23:59:59'),
                    PERIOD FOR SYSTEM_TIME (SysStartTime, SysEndTime);
            ");
            migrationBuilder.Sql($@"
                ALTER TABLE {tableName} SET 
                    (SYSTEM_VERSIONING = ON ( HISTORY_TABLE = {HISTORY_TABLE_SCHEMA}.{tableName} ));
            ");
        }
    }
}