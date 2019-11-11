using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class UpdateAuthoredByToAuthorId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "FamilyDetermination");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Enrollment");

            migrationBuilder.DropColumn(
                name: "AuthoredBy",
                table: "Child");

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Funding",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "FamilyDetermination",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Family",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Enrollment",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Child",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Funding_AuthorId",
                table: "Funding",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyDetermination_AuthorId",
                table: "FamilyDetermination",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Family_AuthorId",
                table: "Family",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_AuthorId",
                table: "Enrollment",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Child_AuthorId",
                table: "Child",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Child_User_AuthorId",
                table: "Child",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollment_User_AuthorId",
                table: "Enrollment",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Family_User_AuthorId",
                table: "Family",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyDetermination_User_AuthorId",
                table: "FamilyDetermination",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Funding_User_AuthorId",
                table: "Funding",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Child_User_AuthorId",
                table: "Child");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollment_User_AuthorId",
                table: "Enrollment");

            migrationBuilder.DropForeignKey(
                name: "FK_Family_User_AuthorId",
                table: "Family");

            migrationBuilder.DropForeignKey(
                name: "FK_FamilyDetermination_User_AuthorId",
                table: "FamilyDetermination");

            migrationBuilder.DropForeignKey(
                name: "FK_Funding_User_AuthorId",
                table: "Funding");

            migrationBuilder.DropIndex(
                name: "IX_Funding_AuthorId",
                table: "Funding");

            migrationBuilder.DropIndex(
                name: "IX_FamilyDetermination_AuthorId",
                table: "FamilyDetermination");

            migrationBuilder.DropIndex(
                name: "IX_Family_AuthorId",
                table: "Family");

            migrationBuilder.DropIndex(
                name: "IX_Enrollment_AuthorId",
                table: "Enrollment");

            migrationBuilder.DropIndex(
                name: "IX_Child_AuthorId",
                table: "Child");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Funding");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "FamilyDetermination");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Family");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Enrollment");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Child");

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Funding",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "FamilyDetermination",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Family",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Enrollment",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthoredBy",
                table: "Child",
                nullable: true);
        }
    }
}
