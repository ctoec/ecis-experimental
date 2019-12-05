using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddDatesToFunding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Permission_User_UserId",
                table: "Permission");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Permission",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "Entry",
                table: "Funding",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Exit",
                table: "Funding",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Permission_UserId1",
                table: "Permission",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_User_UserId",
                table: "Permission",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_User_UserId1",
                table: "Permission",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Permission_User_UserId",
                table: "Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_Permission_User_UserId1",
                table: "Permission");

            migrationBuilder.DropIndex(
                name: "IX_Permission_UserId1",
                table: "Permission");

            migrationBuilder.DropColumn(
                name: "Entry",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "Exit",
                table: "Funding");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Permission",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Permission_User_UserId",
                table: "Permission",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
