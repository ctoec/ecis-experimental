using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Hedwig.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateHistorySchema();
            migrationBuilder.CreateTable(
                name: "Organization",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organization", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ReportingPeriod",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<int>(nullable: false),
                    Period = table.Column<DateTime>(nullable: false),
                    PeriodStart = table.Column<DateTime>(nullable: false),
                    PeriodEnd = table.Column<DateTime>(nullable: false),
                    DueAt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportingPeriod", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WingedKeysId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 35, nullable: false),
                    MiddleName = table.Column<string>(maxLength: 35, nullable: true),
                    LastName = table.Column<string>(maxLength: 35, nullable: false),
                    Suffix = table.Column<string>(maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FundingSpace",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Capacity = table.Column<int>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: false),
                    Source = table.Column<int>(nullable: false),
                    Time = table.Column<int>(nullable: false),
                    AgeGroup = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FundingSpace", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FundingSpace_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Site",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    TitleI = table.Column<bool>(nullable: false),
                    Region = table.Column<int>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Site", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Site_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<int>(nullable: false),
                    ReportingPeriodId = table.Column<int>(nullable: false),
                    SubmittedAt = table.Column<DateTime>(nullable: true),
                    OrganizationId = table.Column<int>(nullable: true),
                    Accredited = table.Column<bool>(nullable: true),
                    C4KRevenue = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RetroactiveC4KRevenue = table.Column<bool>(nullable: true),
                    FamilyFeesRevenue = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Report_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Report_ReportingPeriod_ReportingPeriodId",
                        column: x => x.ReportingPeriodId,
                        principalTable: "ReportingPeriod",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Family",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AuthorId = table.Column<int>(nullable: true),
                    AddressLine1 = table.Column<string>(nullable: true),
                    AddressLine2 = table.Column<string>(nullable: true),
                    Town = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    Zip = table.Column<string>(nullable: true),
                    Homelessness = table.Column<bool>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Family", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Family_User_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Family_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.AddTemporalTableSupport(name: "Family");

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(nullable: false),
                    Type = table.Column<string>(nullable: false),
                    OrganizationId = table.Column<int>(nullable: true),
                    SiteId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Permission_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Permission_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Permission_Site_SiteId",
                        column: x => x.SiteId,
                        principalTable: "Site",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Permission_User_UserId1",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Child",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AuthorId = table.Column<int>(nullable: true),
                    Sasid = table.Column<string>(nullable: true),
                    FirstName = table.Column<string>(maxLength: 35, nullable: false),
                    MiddleName = table.Column<string>(maxLength: 35, nullable: true),
                    LastName = table.Column<string>(maxLength: 35, nullable: false),
                    Suffix = table.Column<string>(maxLength: 10, nullable: true),
                    Birthdate = table.Column<DateTime>(nullable: true),
                    BirthTown = table.Column<string>(nullable: true),
                    BirthState = table.Column<string>(nullable: true),
                    BirthCertificateId = table.Column<string>(nullable: true),
                    AmericanIndianOrAlaskaNative = table.Column<bool>(nullable: false),
                    Asian = table.Column<bool>(nullable: false),
                    BlackOrAfricanAmerican = table.Column<bool>(nullable: false),
                    NativeHawaiianOrPacificIslander = table.Column<bool>(nullable: false),
                    White = table.Column<bool>(nullable: false),
                    HispanicOrLatinxEthnicity = table.Column<bool>(nullable: true),
                    Gender = table.Column<int>(nullable: false),
                    Foster = table.Column<bool>(nullable: false),
                    FamilyId = table.Column<int>(nullable: true),
                    OrganizationId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Child", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Child_User_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Child_Family_FamilyId",
                        column: x => x.FamilyId,
                        principalTable: "Family",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Child_Organization_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organization",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.AddTemporalTableSupport(name: "Child");

            migrationBuilder.CreateTable(
                name: "FamilyDetermination",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AuthorId = table.Column<int>(nullable: true),
                    NotDisclosed = table.Column<bool>(nullable: false),
                    NumberOfPeople = table.Column<int>(nullable: true),
                    Income = table.Column<decimal>(type: "decimal(14,2)", nullable: true),
                    DeterminationDate = table.Column<DateTime>(nullable: true),
                    FamilyId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyDetermination", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyDetermination_User_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FamilyDetermination_Family_FamilyId",
                        column: x => x.FamilyId,
                        principalTable: "Family",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.AddTemporalTableSupport(name: "FamilyDetermination");

            migrationBuilder.CreateTable(
                name: "Enrollment",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AuthorId = table.Column<int>(nullable: true),
                    ChildId = table.Column<Guid>(nullable: false),
                    SiteId = table.Column<int>(nullable: false),
                    AgeGroup = table.Column<int>(nullable: true),
                    Entry = table.Column<DateTime>(nullable: true),
                    Exit = table.Column<DateTime>(nullable: true),
                    ExitReason = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enrollment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Enrollment_User_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Enrollment_Child_ChildId",
                        column: x => x.ChildId,
                        principalTable: "Child",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Enrollment_Site_SiteId",
                        column: x => x.SiteId,
                        principalTable: "Site",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.AddTemporalTableSupport(name: "Enrollment");

            migrationBuilder.CreateTable(
                name: "Funding",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AuthorId = table.Column<int>(nullable: true),
                    EnrollmentId = table.Column<int>(nullable: false),
                    Source = table.Column<int>(nullable: false),
                    FamilyId = table.Column<int>(nullable: true),
                    CertificateStartDate = table.Column<DateTime>(nullable: true),
                    CertificateEndDate = table.Column<DateTime>(nullable: true),
                    FirstReportingPeriodId = table.Column<int>(nullable: true),
                    LastReportingPeriodId = table.Column<int>(nullable: true),
                    Time = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Funding", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Funding_User_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Funding_Enrollment_EnrollmentId",
                        column: x => x.EnrollmentId,
                        principalTable: "Enrollment",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Funding_ReportingPeriod_FirstReportingPeriodId",
                        column: x => x.FirstReportingPeriodId,
                        principalTable: "ReportingPeriod",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Funding_ReportingPeriod_LastReportingPeriodId",
                        column: x => x.LastReportingPeriodId,
                        principalTable: "ReportingPeriod",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });
            migrationBuilder.AddTemporalTableSupport(name: "Funding");

            migrationBuilder.CreateIndex(
                name: "IX_Child_AuthorId",
                table: "Child",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Child_FamilyId",
                table: "Child",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Child_OrganizationId",
                table: "Child",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_AuthorId",
                table: "Enrollment",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_ChildId",
                table: "Enrollment",
                column: "ChildId");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_SiteId",
                table: "Enrollment",
                column: "SiteId");

            migrationBuilder.CreateIndex(
                name: "IX_Family_AuthorId",
                table: "Family",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Family_OrganizationId",
                table: "Family",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyDetermination_AuthorId",
                table: "FamilyDetermination",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyDetermination_FamilyId",
                table: "FamilyDetermination",
                column: "FamilyId");

            migrationBuilder.CreateIndex(
                name: "IX_Funding_AuthorId",
                table: "Funding",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Funding_EnrollmentId",
                table: "Funding",
                column: "EnrollmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Funding_FirstReportingPeriodId",
                table: "Funding",
                column: "FirstReportingPeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_Funding_LastReportingPeriodId",
                table: "Funding",
                column: "LastReportingPeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_FundingSpace_OrganizationId",
                table: "FundingSpace",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Permission_OrganizationId",
                table: "Permission",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Permission_UserId",
                table: "Permission",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Permission_SiteId",
                table: "Permission",
                column: "SiteId");

            migrationBuilder.CreateIndex(
                name: "IX_Permission_UserId1",
                table: "Permission",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_OrganizationId",
                table: "Report",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_ReportingPeriodId",
                table: "Report",
                column: "ReportingPeriodId");

            migrationBuilder.CreateIndex(
                name: "IX_Site_OrganizationId",
                table: "Site",
                column: "OrganizationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RemoveTemporalTableSupport(
                name: "FamilyDetermination");
            migrationBuilder.DropTable(
                name: "FamilyDetermination");

            migrationBuilder.RemoveTemporalTableSupport(
                name: "Funding");
            migrationBuilder.DropTable(
                name: "Funding");

            migrationBuilder.DropTable(
                name: "FundingSpace");

            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.RemoveTemporalTableSupport(
                name: "Enrollment");
            migrationBuilder.DropTable(
                name: "Enrollment");

            migrationBuilder.DropTable(
                name: "ReportingPeriod");

            migrationBuilder.RemoveTemporalTableSupport(
                name: "Child");
            migrationBuilder.DropTable(
                name: "Child");

            migrationBuilder.DropTable(
                name: "Site");

            migrationBuilder.RemoveTemporalTableSupport(
                name: "Family");
            migrationBuilder.DropTable(
                name: "Family");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Organization");
        }
    }
}
