using System;
using System.Linq;
using Hedwig.Models;

namespace Hedwig.Data
{
  public class DbInitializer
  {
    protected HedwigContext _context;

    public DbInitializer(HedwigContext context)
    {
      _context = context;
    }

    public void Initialize()
    {
      Seed();
    }

    public void Seed()
    {
      DeleteAllData();

      var organization = CreateOrganization();

      CreateFundingSpace(organizationId: organization.Id, ageGroup: Age.Infant, time: FundingTime.Full, capacity: 10);
      CreateFundingSpace(organizationId: organization.Id, ageGroup: Age.Preschool, time: FundingTime.Full, capacity: 20);

      var site = CreateSite(organizationId: organization.Id);

      var user = CreateUser(wingedKeysId: Guid.Parse("2c0ec653-8829-4aa1-82ba-37c8832bbb88"));

      CreateOrganizationPermission(organizationId: organization.Id, userId: user.Id);

      var reportingPeriods = new ReportingPeriod[] {
        CreateReportingPeriod(period: "2019-08-01", start: "2019-07-29", end: "2019-09-01", due: "2019-09-15"),
        CreateReportingPeriod(period: "2019-09-01", start: "2019-09-02", end: "2019-09-29", due: "2019-10-15"),
        CreateReportingPeriod(period: "2019-10-01", start: "2019-09-30", end: "2019-10-29", due: "2019-11-15"),
        CreateReportingPeriod(period: "2019-11-01", start: "2019-10-30", end: "2019-12-01", due: "2019-12-15")
      };

      CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[0].Id, submittedAt: "2019-09-09");
      CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[1].Id, submittedAt: "2019-10-04");
      CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[2].Id, submittedAt: "2019-11-12");
      CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[3].Id);

      var lines = new string[] {
        "Alan,Rickman,2018-12-07,Male,TRUE,2019-09-02,,CDC,",
        "David,Thewlis,2016-07-29,Male,TRUE,2019-09-02,,CDC,",
        "Helena,Bonham Carter,2016-01-01,Female,TRUE,2019-09-02,,,",
        "Maggie,Smith,2015-02-02,Female,TRUE,2018-09-03,,CDC,",
        "Michael,Gambon,2015-07-06,Male,TRUE,2018-09-03,,CDC,",
        "Richard,Griffiths,2018-07-02,Male,TRUE,2019-09-02,,CDC,",
        "Richard,Harris,2015-12-23,Male,TRUE,2018-09-03,,CDC,",
        "Warwick,Davis,2018-11-25,Male,FALSE,2019-09-02,,CDC,",
        "Emma,Thompson,2016-08-03,Female,TRUE,2019-09-02,,CDC,",
        "Robbie,Coltrane,2017-10-27,Male,TRUE,2019-09-02,,CDC,",
        "David,Bradley,2014-11-20,Male,TRUE,2018-09-03,2019-08-30,CDC,",
        "John,Cleese,2015-10-21,Male,TRUE,2019-09-02,,,",
        "John,Hurt,2018-02-14,Male,TRUE,2019-09-02,,CDC,",
        "Kenneth,Branagh,2018-08-19,Male,FALSE,2019-09-02,,CDC,",
        "Miranda,Richardson,2018-11-09,Female,TRUE,2019-09-02,,CDC,",
        "Matthew,Lewis,2017-12-07,Male,TRUE,2019-09-02,,,",
        "Tom,Felton,2015-07-29,Male,TRUE,2019-09-02,,CDC,",
        "Daniel,Radcliffe,2015-01-01,Male,TRUE,2019-09-02,,CDC,",
        "Emma,Watson,2015-03-02,Female,TRUE,2018-09-03,,,",
        "Alfred,Enoch,2015-09-06,Male,TRUE,2018-09-03,2019-08-30,CDC,",
        "Ralph,Fiennes,2017-07-02,Male,TRUE,2019-09-02,,CDC,",
        "James,Phelps,2014-12-23,Male,TRUE,2018-09-03,,,",
        "Oliver,Phelps,2017-11-25,Male,TRUE,2019-09-02,,CDC,",
        "Bonnie,Wright,2015-08-03,Female,TRUE,2019-09-02,,,",
        "Julie,Walters,2016-10-27,Female,TRUE,2019-09-02,,CDC,",
        "Chris,Rankin,2014-12-20,Male,TRUE,2018-09-03,2019-08-30,CDC,",
        "Rupert,Grint,2015-01-21,Male,TRUE,2019-09-02,,CDC,",
        "Robert,Hardy,2017-02-14,Male,TRUE,2019-09-02,,CDC,",
        "Jason,Isaacs,2017-08-19,Male,TRUE,2019-09-02,,CDC,",
        "Mark,Williams,2017-11-09,Male,TRUE,2019-09-02,,CDC,",
        "Timothy,Spall,2016-12-07,Male,TRUE,2019-09-02,,CDC,",
        "Katie,Leung,2016-07-29,Female,TRUE,2019-09-02,,CDC,",
        "Robert,Pattinson,2015-04-01,Male,TRUE,2019-09-02,,CDC,",
        "Evanna,Lynch,2015-02-03,Female,TRUE,2018-09-03,,,",
        "Imelda,Staunton,2016-07-06,Female,TRUE,2018-09-03,,CDC,",
        "Joshua,Herdman,2016-07-02,Male,TRUE,2019-09-02,,CDC,",
        "Ian,Hart,2015-12-02,Male,TRUE,2018-09-03,2019-08-30,CDC,",
        "David,Tennant,2017-11-25,Male,TRUE,2019-09-02,,CDC,",
        "Devon,Murray,2017-08-03,Male,TRUE,2019-09-02,,CDC,",
        "Harry,Melling,2016-10-27,Male,TRUE,2019-09-02,,CDC,"
      }.ToList();

      lines.ForEach(line =>
      {
        var cells = line.Split(",");

        var firstName = cells[0];
        var lastName = cells[1];
        var birthdate = cells[2];
        var gender = cells[3] == "Male" ? Gender.Male : Gender.Female;
        var birthCertificateRecorded = cells[4] == "TRUE";
        var entry = cells[5];
        var exit = cells[6] != "" ? cells[6] : null;
        var cdc = cells[7] == "CDC";

        var family = CreateFamily(organizationId: organization.Id);
        CreateFamilyDetermination(familyId: family.Id);

        var child = CreateChild(
          organizationId: organization.Id,
          familyId: family.Id,
          firstName: firstName,
          lastName: lastName,
          birthdate: birthdate,
          gender: gender,
          birthCertificateRecorded: birthCertificateRecorded
        );

        var ageGroupCutoff = DateTime.Parse("2017-09-01");

        var enrollment = CreateEnrollment(
          childId: child.Id,
          siteId: site.Id,
          entry: entry,
          exit: exit,
          ageGroup: DateTime.Parse(birthdate) > ageGroupCutoff ? Age.Infant : Age.Preschool
        );

        if (cdc)
        {
          CreateFunding(
            enrollmentId: enrollment.Id,
            source: FundingSource.CDC,
            entry: entry,
            exit: exit != null ? "2019-09-01" : null,
            time: FundingTime.Full
          );
        }
      });
    }

    private void DeleteAllData()
    {
      _context.Permissions.RemoveRange(_context.Permissions.ToList());
      _context.FamilyDeterminations.RemoveRange(_context.FamilyDeterminations.ToList());
      _context.Families.RemoveRange(_context.Families.ToList());
      _context.Children.RemoveRange(_context.Children.ToList());
      _context.Enrollments.RemoveRange(_context.Enrollments.ToList());
      _context.Fundings.RemoveRange(_context.Fundings.ToList());
      _context.FundingSpaces.RemoveRange(_context.FundingSpaces.ToList());
      _context.ReportingPeriods.RemoveRange(_context.ReportingPeriods.ToList());
      _context.Reports.RemoveRange(_context.Reports.ToList());
      _context.Sites.RemoveRange(_context.Sites.ToList());
      _context.Organizations.RemoveRange(_context.Organizations.ToList());
      _context.Users.RemoveRange(_context.Users.ToList());
    }

    private Organization CreateOrganization(string name = "Children's Adventure Center")
    {
      var organization = new Organization { Name = name };
      _context.Organizations.Add(organization);
      _context.SaveChanges();
      return organization;
    }

    private FundingSpace CreateFundingSpace(
      int organizationId,
      FundingSource source = FundingSource.CDC,
      Age ageGroup = Age.Preschool,
      FundingTime time = FundingTime.Full,
      int capacity = 10
    )
    {
      var space = new FundingSpace
      {
        OrganizationId = organizationId,
        Source = source,
        AgeGroup = ageGroup,
        Time = time,
        Capacity = capacity
      };
      _context.FundingSpaces.Add(space);
      _context.SaveChanges();
      return space;
    }

    private Site CreateSite(int organizationId, string name = "Children's Adventure Center")
    {
      var site = new Hedwig.Models.Site { OrganizationId = organizationId, Name = name };
      _context.Sites.Add(site);
      _context.SaveChanges();
      return site;
    }

    private User CreateUser(Guid wingedKeysId, string firstName = "Chris", string lastName = "Given")
    {
      var user = new User { WingedKeysId = wingedKeysId, FirstName = firstName, LastName = lastName };
      _context.Users.Add(user);
      _context.SaveChanges();
      return user;
    }

    private OrganizationPermission CreateOrganizationPermission(int organizationId, int userId)
    {
      var permission = new OrganizationPermission { OrganizationId = organizationId, UserId = userId };
      _context.Permissions.Add(permission);
      _context.SaveChanges();
      return permission;
    }

    private Family CreateFamily(int organizationId)
    {
      var family = new Family { OrganizationId = organizationId };
      _context.Families.Add(family);
      _context.SaveChanges();
      return family;
    }

    private FamilyDetermination CreateFamilyDetermination(
      int familyId,
      int numberOfPeople = 3,
      decimal income = 20000M,
      string determined = "2019-08-01"
    )
    {
      var familyDetermination = new FamilyDetermination
      {
        FamilyId = familyId,
        NumberOfPeople = numberOfPeople,
        Income = income,
        Determined = DateTime.Parse(determined)
      };
      _context.FamilyDeterminations.Add(familyDetermination);
      _context.SaveChanges();
      return familyDetermination;
    }

    private Child CreateChild(
      int organizationId,
      int? familyId = null,
      string firstName = "John",
      string lastName = "Doe",
      string birthdate = "2016-06-01",
      Gender gender = Gender.Unspecified,
      bool birthCertificateRecorded = true
    )
    {
      var rand = new Random();
      var randomIsWhite = rand.Next(2) > 0;
      var randomIsHispanic = rand.Next(2) > 0;
      var child = new Child
      {
        OrganizationId = organizationId,
        FamilyId = familyId,
        FirstName = firstName,
        LastName = lastName,
        Birthdate = DateTime.Parse(birthdate),
        Gender = gender,
        White = randomIsWhite,
        BlackOrAfricanAmerican = !randomIsWhite,
        HispanicOrLatinxEthnicity = randomIsHispanic
      };

      if (birthCertificateRecorded)
      {
        child.BirthCertificateId = rand.Next(10000000, 100000000).ToString();
        child.BirthTown = "Hartford";
        child.BirthState = "CT";
      }

      _context.Children.Add(child);
      _context.SaveChanges();
      return child;
    }

    private Enrollment CreateEnrollment(
      Guid childId,
      int siteId,
      string entry = "2019-08-01",
      string exit = null,
      Age ageGroup = Age.Preschool
    )
    {
      var enrollment = new Enrollment
      {
        ChildId = childId,
        SiteId = siteId,
        Entry = DateTime.Parse(entry),
        AgeGroup = ageGroup
      };
      if (exit != null)
      {
        enrollment.Exit = DateTime.Parse(exit);
      }
      _context.Enrollments.Add(enrollment);
      _context.SaveChanges();
      return enrollment;
    }

    private Funding CreateFunding(
      int enrollmentId,
      FundingSource source,
      string entry = "2019-08-05",
      string exit = null,
      FundingTime time = FundingTime.Full
    )
    {
      var funding = new Funding
      {
        EnrollmentId = enrollmentId,
        Source = source,
        Entry = DateTime.Parse(entry),
        Time = time
      };

      if (exit != null)
      {
        funding.Exit = DateTime.Parse(exit);
      }

      _context.Fundings.Add(funding);
      _context.SaveChanges();
      return funding;
    }

    private ReportingPeriod CreateReportingPeriod(
      string period,
      string start,
      string end,
      string due,
      FundingSource type = FundingSource.CDC
    )
    {
      var reportingPeriod = new ReportingPeriod
      {
        Type = type,
        Period = DateTime.Parse(period),
        PeriodStart = DateTime.Parse(start),
        PeriodEnd = DateTime.Parse(end),
        DueAt = DateTime.Parse(due)
      };

      _context.ReportingPeriods.Add(reportingPeriod);
      _context.SaveChanges();
      return reportingPeriod;
    }

    private Report CreateCdcReport(
      int organizationId,
      int reportingPeriodId,
      string submittedAt = null,
      bool accredited = true
    )
    {
      var report = new CdcReport
      {
        OrganizationId = organizationId,
        ReportingPeriodId = reportingPeriodId,
        Accredited = accredited
      };

      if (submittedAt != null)
      {
        report.SubmittedAt = DateTime.Parse(submittedAt);
      }

      _context.Reports.Add(report);
      _context.SaveChanges();
      return report;
    }
  }
}
