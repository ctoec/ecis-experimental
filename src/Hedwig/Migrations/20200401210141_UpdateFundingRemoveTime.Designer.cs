﻿// <auto-generated />
using System;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Hedwig.Migrations
{
    [DbContext(typeof(HedwigContext))]
    [Migration("20200401210141_UpdateFundingRemoveTime")]
    partial class UpdateFundingRemoveTime
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Hedwig.Models.C4KCertificate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<Guid>("ChildId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("ChildId");

                    b.ToTable("C4KCertificate");
                });

            modelBuilder.Entity("Hedwig.Models.Child", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("AmericanIndianOrAlaskaNative")
                        .HasColumnType("bit");

                    b.Property<bool>("Asian")
                        .HasColumnType("bit");

                    b.Property<int?>("AuthorId")
                        .HasColumnType("int");

                    b.Property<string>("BirthCertificateId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("BirthState")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("BirthTown")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("Birthdate")
                        .HasColumnType("date");

                    b.Property<bool>("BlackOrAfricanAmerican")
                        .HasColumnType("bit");

                    b.Property<int?>("C4KFamilyCaseNumber")
                        .HasColumnType("int");

                    b.Property<int?>("FamilyId")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(35)")
                        .HasMaxLength(35);

                    b.Property<bool>("Foster")
                        .HasColumnType("bit");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<bool?>("HispanicOrLatinxEthnicity")
                        .HasColumnType("bit");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(35)")
                        .HasMaxLength(35);

                    b.Property<string>("MiddleName")
                        .HasColumnType("nvarchar(35)")
                        .HasMaxLength(35);

                    b.Property<bool>("NativeHawaiianOrPacificIslander")
                        .HasColumnType("bit");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<string>("Sasid")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Suffix")
                        .HasColumnType("nvarchar(10)")
                        .HasMaxLength(10);

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("White")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("FamilyId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Child");
                });

            modelBuilder.Entity("Hedwig.Models.Enrollment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AgeGroup")
                        .HasColumnType("int");

                    b.Property<int?>("AuthorId")
                        .HasColumnType("int");

                    b.Property<Guid>("ChildId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("Entry")
                        .HasColumnType("date");

                    b.Property<DateTime?>("Exit")
                        .HasColumnType("date");

                    b.Property<string>("ExitReason")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("SiteId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("ChildId");

                    b.HasIndex("SiteId");

                    b.ToTable("Enrollment");
                });

            modelBuilder.Entity("Hedwig.Models.Family", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AddressLine1")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AddressLine2")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("AuthorId")
                        .HasColumnType("int");

                    b.Property<bool>("Homelessness")
                        .HasColumnType("bit");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<string>("State")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Town")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Zip")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Family");
                });

            modelBuilder.Entity("Hedwig.Models.FamilyDetermination", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AuthorId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("DeterminationDate")
                        .HasColumnType("date");

                    b.Property<int>("FamilyId")
                        .HasColumnType("int");

                    b.Property<decimal?>("Income")
                        .HasColumnType("decimal(14,2)");

                    b.Property<bool>("NotDisclosed")
                        .HasColumnType("bit");

                    b.Property<int?>("NumberOfPeople")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("FamilyId");

                    b.ToTable("FamilyDetermination");
                });

            modelBuilder.Entity("Hedwig.Models.Funding", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("AuthorId")
                        .HasColumnType("int");

                    b.Property<int>("EnrollmentId")
                        .HasColumnType("int");

                    b.Property<int?>("FirstReportingPeriodId")
                        .HasColumnType("int");

                    b.Property<int?>("FundingSpaceId")
                        .HasColumnType("int");

                    b.Property<int?>("LastReportingPeriodId")
                        .HasColumnType("int");

                    b.Property<int?>("Source")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("EnrollmentId");

                    b.HasIndex("FirstReportingPeriodId");

                    b.HasIndex("FundingSpaceId");

                    b.HasIndex("LastReportingPeriodId");

                    b.ToTable("Funding");
                });

            modelBuilder.Entity("Hedwig.Models.FundingSpace", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("AgeGroup")
                        .HasColumnType("int");

                    b.Property<int>("Capacity")
                        .HasColumnType("int");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<int>("Source")
                        .HasColumnType("int");

                    b.Property<int>("Time")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.ToTable("FundingSpace");
                });

            modelBuilder.Entity("Hedwig.Models.Organization", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(100)")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.ToTable("Organization");
                });

            modelBuilder.Entity("Hedwig.Models.Permission", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Permission");

                    b.HasDiscriminator<string>("Type").HasValue("Permission");
                });

            modelBuilder.Entity("Hedwig.Models.Report", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("ReportingPeriodId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("SubmittedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ReportingPeriodId");

                    b.ToTable("Report");

                    b.HasDiscriminator<int>("Type");
                });

            modelBuilder.Entity("Hedwig.Models.ReportingPeriod", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("DueAt")
                        .HasColumnType("date");

                    b.Property<DateTime>("Period")
                        .HasColumnType("date");

                    b.Property<DateTime>("PeriodEnd")
                        .HasColumnType("date");

                    b.Property<DateTime>("PeriodStart")
                        .HasColumnType("date");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("ReportingPeriod");
                });

            modelBuilder.Entity("Hedwig.Models.Site", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("FacilityCode")
                        .HasColumnType("int");

                    b.Property<int?>("LicenseNumber")
                        .HasColumnType("int");

                    b.Property<int?>("NaeycId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(100)")
                        .HasMaxLength(100);

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.Property<int>("Region")
                        .HasColumnType("int");

                    b.Property<int?>("RegistryId")
                        .HasColumnType("int");

                    b.Property<bool>("TitleI")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Site");
                });

            modelBuilder.Entity("Hedwig.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(35)")
                        .HasMaxLength(35);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(35)")
                        .HasMaxLength(35);

                    b.Property<string>("MiddleName")
                        .HasColumnType("nvarchar(35)")
                        .HasMaxLength(35);

                    b.Property<string>("Suffix")
                        .HasColumnType("nvarchar(10)")
                        .HasMaxLength(10);

                    b.Property<Guid>("WingedKeysId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.ToTable("User");
                });

            modelBuilder.Entity("Hedwig.Models.OrganizationPermission", b =>
                {
                    b.HasBaseType("Hedwig.Models.Permission");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.HasIndex("OrganizationId");

                    b.HasIndex("UserId");

                    b.HasDiscriminator().HasValue("Organization");
                });

            modelBuilder.Entity("Hedwig.Models.SitePermission", b =>
                {
                    b.HasBaseType("Hedwig.Models.Permission");

                    b.Property<int>("SiteId")
                        .HasColumnType("int");

                    b.HasIndex("SiteId");

                    b.HasIndex("UserId")
                        .HasName("IX_Permission_UserId1");

                    b.HasDiscriminator().HasValue("Site");
                });

            modelBuilder.Entity("Hedwig.Models.OrganizationReport", b =>
                {
                    b.HasBaseType("Hedwig.Models.Report");

                    b.Property<int>("OrganizationId")
                        .HasColumnType("int");

                    b.HasIndex("OrganizationId");

                    b.HasDiscriminator();
                });

            modelBuilder.Entity("Hedwig.Models.CdcReport", b =>
                {
                    b.HasBaseType("Hedwig.Models.OrganizationReport");

                    b.Property<bool>("Accredited")
                        .HasColumnType("bit");

                    b.Property<decimal>("C4KRevenue")
                        .HasColumnType("decimal(18,2)");

                    b.Property<string>("Comment")
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal?>("FamilyFeesRevenue")
                        .IsRequired()
                        .HasColumnType("decimal(18,2)");

                    b.Property<bool>("RetroactiveC4KRevenue")
                        .HasColumnType("bit");

                    b.HasDiscriminator().HasValue(0);
                });

            modelBuilder.Entity("Hedwig.Models.C4KCertificate", b =>
                {
                    b.HasOne("Hedwig.Models.Child", null)
                        .WithMany("C4KCertificates")
                        .HasForeignKey("ChildId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.Child", b =>
                {
                    b.HasOne("Hedwig.Models.User", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.Family", "Family")
                        .WithMany("Children")
                        .HasForeignKey("FamilyId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.Enrollment", b =>
                {
                    b.HasOne("Hedwig.Models.User", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.Child", "Child")
                        .WithMany("Enrollments")
                        .HasForeignKey("ChildId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Hedwig.Models.Site", "Site")
                        .WithMany("Enrollments")
                        .HasForeignKey("SiteId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.Family", b =>
                {
                    b.HasOne("Hedwig.Models.User", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.FamilyDetermination", b =>
                {
                    b.HasOne("Hedwig.Models.User", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.Family", "Family")
                        .WithMany("Determinations")
                        .HasForeignKey("FamilyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.Funding", b =>
                {
                    b.HasOne("Hedwig.Models.User", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.Enrollment", "Enrollment")
                        .WithMany("Fundings")
                        .HasForeignKey("EnrollmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Hedwig.Models.ReportingPeriod", "FirstReportingPeriod")
                        .WithMany()
                        .HasForeignKey("FirstReportingPeriodId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.FundingSpace", "FundingSpace")
                        .WithMany("Fundings")
                        .HasForeignKey("FundingSpaceId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Hedwig.Models.ReportingPeriod", "LastReportingPeriod")
                        .WithMany()
                        .HasForeignKey("LastReportingPeriodId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Hedwig.Models.FundingSpace", b =>
                {
                    b.HasOne("Hedwig.Models.Organization", "Organization")
                        .WithMany("FundingSpaces")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.Report", b =>
                {
                    b.HasOne("Hedwig.Models.ReportingPeriod", "ReportingPeriod")
                        .WithMany()
                        .HasForeignKey("ReportingPeriodId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.Site", b =>
                {
                    b.HasOne("Hedwig.Models.Organization", "Organization")
                        .WithMany("Sites")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.OrganizationPermission", b =>
                {
                    b.HasOne("Hedwig.Models.Organization", "Organization")
                        .WithMany()
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Hedwig.Models.User", "User")
                        .WithMany("OrgPermissions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.SitePermission", b =>
                {
                    b.HasOne("Hedwig.Models.Site", "Site")
                        .WithMany()
                        .HasForeignKey("SiteId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Hedwig.Models.User", "User")
                        .WithMany("SitePermissions")
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_Permission_User_UserId1")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Hedwig.Models.OrganizationReport", b =>
                {
                    b.HasOne("Hedwig.Models.Organization", "Organization")
                        .WithMany("Reports")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
