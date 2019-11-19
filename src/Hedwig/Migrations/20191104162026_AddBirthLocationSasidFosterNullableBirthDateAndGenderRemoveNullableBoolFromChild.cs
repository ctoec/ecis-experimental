using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace hedwig.Migrations
{
    public partial class AddBirthLocationSasidFosterNullableBirthDateAndGenderRemoveNullableBoolFromChild : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "White",
                table: "Child");
            
            migrationBuilder.AddColumn<bool>(
                name: "White",
                table: "Child",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.DropColumn(
                name: "NativeHawaiianOrPacificIslander",
                table: "Child");
            
            migrationBuilder.AddColumn<bool>(
                name: "NativeHawaiianOrPacificIslander",
                table: "Child",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.DropColumn(
                name: "HispanicOrLatinxEthnicity",
                table: "Child");
            
            migrationBuilder.AddColumn<bool>(
                name: "HispanicOrLatinxEthnicity",
                table: "Child",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "Child",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.DropColumn(
                name: "BlackOrAfricanAmerican",
                table: "Child");
            
            migrationBuilder.AddColumn<bool>(
                name: "BlackOrAfricanAmerican",
                table: "Child",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AlterColumn<DateTime>(
                name: "Birthdate",
                table: "Child",
                nullable: true,
                oldClrType: typeof(DateTime));

            migrationBuilder.DropColumn(
                name: "Asian",
                table: "Child");
            
            migrationBuilder.AddColumn<bool>(
                name: "Asian",
                table: "Child",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.DropColumn(
                name: "AmericanIndianOrAlaskaNative",
                table: "Child");
            
            migrationBuilder.AddColumn<bool>(
                name: "AmericanIndianOrAlaskaNative",
                table: "Child",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AddColumn<string>(
                name: "BirthCertificateId",
                table: "Child",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BirthState",
                table: "Child",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BirthTown",
                table: "Child",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Foster",
                table: "Child",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Sasid",
                table: "Child",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthCertificateId",
                table: "Child");

            migrationBuilder.DropColumn(
                name: "BirthState",
                table: "Child");

            migrationBuilder.DropColumn(
                name: "BirthTown",
                table: "Child");

            migrationBuilder.DropColumn(
                name: "Foster",
                table: "Child");

            migrationBuilder.DropColumn(
                name: "Sasid",
                table: "Child");

            migrationBuilder.AlterColumn<bool>(
                name: "White",
                table: "Child",
                nullable: true,
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<bool>(
                name: "NativeHawaiianOrPacificIslander",
                table: "Child",
                nullable: true,
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<bool>(
                name: "HispanicOrLatinxEthnicity",
                table: "Child",
                nullable: true,
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "Child",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "BlackOrAfricanAmerican",
                table: "Child",
                nullable: true,
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<DateTime>(
                name: "Birthdate",
                table: "Child",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Asian",
                table: "Child",
                nullable: true,
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<bool>(
                name: "AmericanIndianOrAlaskaNative",
                table: "Child",
                nullable: true,
                oldClrType: typeof(bool));
        }
    }
}
