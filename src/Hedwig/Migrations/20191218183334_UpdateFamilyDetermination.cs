using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class UpdateFamilyDetermination : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Determined",
                table: "FamilyDetermination");

            migrationBuilder.AlterColumn<int>(
                name: "NumberOfPeople",
                table: "FamilyDetermination",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Income",
                table: "FamilyDetermination",
                type: "decimal(14,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeterminationDate",
                table: "FamilyDetermination",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeterminationDate",
                table: "FamilyDetermination");

            migrationBuilder.AlterColumn<int>(
                name: "NumberOfPeople",
                table: "FamilyDetermination",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Income",
                table: "FamilyDetermination",
                type: "decimal(14,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Determined",
                table: "FamilyDetermination",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
