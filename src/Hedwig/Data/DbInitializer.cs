using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Hedwig.Models;

namespace Hedwig.Data
{
	public static class DbInitializer
	{
		public static void Initialize(HedwigContext context)
		{
			context.Database.EnsureCreated();

			if (context.Sites.Any())
			{
				return; // DB has already been seeded
			}

			var organizations = new Hedwig.Models.Organization[]
			{
				new Hedwig.Models.Organization { Name = "Children's Adventure Center" }
			};

			foreach (Hedwig.Models.Organization o in organizations)
			{
				context.Organizations.Add(o);
			}
			context.SaveChanges();

			var sites = new Site[]
			{
				new Site { Name = "Children's Adventure Center", OrganizationId = organizations[0].Id }
			};

			foreach (Site s in sites)
			{
				context.Sites.Add(s);
			}
			context.SaveChanges();

			var users = new User[]
			{
				new User { FirstName = "Chris", LastName = "Given" }
			};

			foreach (User u in users)
			{
				context.Users.Add(u);
			}
			context.SaveChanges();

			var permissions = new Permission[]
			{
				new OrganizationPermission { UserId = users[0].Id, OrganizationId = organizations[0].Id }
			};

			foreach (Permission p in permissions)
			{
				context.Permissions.Add(p);
			}
			context.SaveChanges();

			var families = Enumerable.Range(1, 15)
				.Select(i => new Family{Organization = organizations[0]})
				.ToArray();

			foreach (Family f in families)
			{
				context.Families.Add(f);
			}
			context.SaveChanges();

			var recentDeterminations = families.Take(8).Select(f =>
				new FamilyDetermination
				{
					NumberOfPeople = 3,
					Income = 20000M,
					Determined = DateTime.Parse("2019-08-01"),
					FamilyId = f.Id
				}
			);

			var expiredDeterminations = families.Skip(8).Take(2).Select(f =>
				new FamilyDetermination
				{
					NumberOfPeople = 3,
					Income = 20000M,
					Determined = DateTime.Parse("2018-05-01"),
					FamilyId = f.Id
				}
			);

			var determinations = recentDeterminations.Concat(expiredDeterminations).ToArray();

			foreach (FamilyDetermination d in determinations)
			{
				context.FamilyDeterminations.Add(d);
			}
			context.SaveChanges();

			var children = new Child[] {
				new Child { FirstName = "Alan", LastName = "Rickman",
					Birthdate = DateTime.Parse("2018-12-07"), Gender = Gender.Male,
					FamilyId = families[0].Id,
					Organization = organizations[0]
				},
				new Child { FirstName = "David", LastName = "Thewlis",
					Birthdate = DateTime.Parse("2016-07-29"), Gender = Gender.Male,
					FamilyId = families[1].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Helena", LastName = "Bonham Carter",
					Birthdate = DateTime.Parse("2016-01-01"), Gender = Gender.Female,
					FamilyId = families[2].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Maggie", LastName = "Smith",
					Birthdate = DateTime.Parse("2015-02-02"), Gender = Gender.Female,
					FamilyId = families[3].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Michael", LastName = "Gambon",
					Birthdate = DateTime.Parse("2015-07-06"), Gender = Gender.Male,
					FamilyId = families[4].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Richard", LastName = "Griffiths",
					Birthdate = DateTime.Parse("2018-07-02"), Gender = Gender.Male,
					FamilyId = families[5].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Richard", LastName = "Harris",
					Birthdate = DateTime.Parse("2015-12-23"), Gender = Gender.Male,
					FamilyId = families[6].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Warwick", LastName = "Davis",
					Birthdate = DateTime.Parse("2018-11-25"), Gender = Gender.Male,
					FamilyId = families[7].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Emma", LastName = "Thompson",
					Birthdate = DateTime.Parse("2016-08-03"), Gender = Gender.Female,
					FamilyId = families[8].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Robbie", LastName = "Coltrane",
					Birthdate = DateTime.Parse("2017-10-27"), Gender = Gender.Male,
					FamilyId = families[9].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "David", LastName = "Bradley",
					Birthdate = DateTime.Parse("2014-11-20"), Gender = Gender.Male,
					FamilyId = families[10].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "John", LastName = "Cleese",
					Birthdate = DateTime.Parse("2015-10-21"), Gender = Gender.Male,
					FamilyId = families[11].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "John", LastName = "Hurt",
					Birthdate = DateTime.Parse("2018-02-14"), Gender = Gender.Male,
					FamilyId = families[12].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Kenneth", LastName = "Branagh",
					Birthdate = DateTime.Parse("2018-08-19"), Gender = Gender.Male,
					FamilyId = families[13].Id,
					Organization = organizations[0]

				},
				new Child { FirstName = "Miranda", LastName = "Richardson",
					Birthdate = DateTime.Parse("2018-11-09"), Gender = Gender.Female,
					FamilyId = families[14].Id,
					Organization = organizations[0]

				}
			};

			foreach (Child c in children)
			{
				context.Children.Add(c);
			}
			context.SaveChanges();

			var enrollments = new Enrollment[] {
				new Enrollment { ChildId = children[0].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2019-07-01")
				},
				new Enrollment { ChildId = children[1].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2017-05-06")
				},
				new Enrollment { ChildId = children[2].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2017-11-12")
				},
				new Enrollment { ChildId = children[3].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2016-09-26")
				},
				new Enrollment { ChildId = children[4].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2016-10-20")
				},
				new Enrollment { ChildId = children[5].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2019-03-26")
				},
				new Enrollment { ChildId = children[6].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2017-01-14")
				},
				new Enrollment { ChildId = children[7].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2019-08-07")
				},
				new Enrollment { ChildId = children[8].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2018-04-28")
				},
				new Enrollment { ChildId = children[9].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2018-04-23")
				},
				new Enrollment { ChildId = children[10].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2016-10-25")
				},
				new Enrollment { ChildId = children[11].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2016-06-16")
				},
				new Enrollment { ChildId = children[12].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2019-07-01")
				},
				new Enrollment { ChildId = children[13].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2019-05-08")
				},
				new Enrollment { ChildId = children[14].Id, SiteId = sites[0].Id,
					Entry = DateTime.Parse("2019-07-01")
				}
			};

			foreach (Enrollment e in enrollments)
			{
				context.Enrollments.Add(e);
			}
			context.SaveChanges();

			var fundings = enrollments.Take(10).Select(e =>
				new Funding
				{
					EnrollmentId = e.Id,
					Source = FundingSource.CDC,
					Time = FundingTime.Full
				}
			).ToArray();

			foreach (Funding f in fundings)
			{
				context.Fundings.Add(f);
			}
			context.SaveChanges();

			var reportingPeriods = new ReportingPeriod[] {
				new ReportingPeriod {
					Type = FundingSource.CDC,
					Period = DateTime.Parse("2019-06-01"),
					PeriodStart = DateTime.Parse("2019-06-03"),
					PeriodEnd = DateTime.Parse("2019-06-30"),
					DueAt = DateTime.Parse("2019-07-15")
				},
				new ReportingPeriod {
					Type = FundingSource.CDC,
					Period = DateTime.Parse("2019-07-01"),
					PeriodStart = DateTime.Parse("2019-07-01"),
					PeriodEnd = DateTime.Parse("2019-07-28"),
					DueAt = DateTime.Parse("2019-08-15")
				},
				new ReportingPeriod {
					Type = FundingSource.CDC,
					Period = DateTime.Parse("2019-08-01"),
					PeriodStart = DateTime.Parse("2019-07-29"),
					PeriodEnd = DateTime.Parse("2019-09-01"),
					DueAt = DateTime.Parse("2019-09-15")
				},
				new ReportingPeriod {
					Type = FundingSource.CDC,
					Period = DateTime.Parse("2019-09-01"),
					PeriodStart = DateTime.Parse("2019-09-02"),
					PeriodEnd = DateTime.Parse("2019-09-29"),
					DueAt = DateTime.Parse("2019-10-15")
				}
			};

			foreach (ReportingPeriod p in reportingPeriods)
			{
				context.ReportingPeriods.Add(p);
			}
			context.SaveChanges();

			var reports = new Report[] {
				new CdcReport { OrganizationId = organizations[0].Id, ReportingPeriodId = reportingPeriods[0].Id, SubmittedAt = DateTime.Parse("2019-07-10") },
				new CdcReport { OrganizationId = organizations[0].Id, ReportingPeriodId = reportingPeriods[1].Id, SubmittedAt = DateTime.Parse("2019-08-13") },
				new CdcReport { OrganizationId = organizations[0].Id, ReportingPeriodId = reportingPeriods[2].Id, SubmittedAt = DateTime.Parse("2019-09-09") },
				new CdcReport { OrganizationId = organizations[0].Id, ReportingPeriodId = reportingPeriods[3].Id }
			};

			foreach (Report r in reports)
			{
				context.Reports.Add(r);
			}
			context.SaveChanges();
		}
	}
}
