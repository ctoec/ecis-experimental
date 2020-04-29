using System;
using System.Linq;
using System.Collections.Generic;
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

			var organization = CreateOrganization(name: "Hogwarts Child Development Center, Inc.");

			var infantToddlerPartTimeFundingSpace = CreateFundingSpace(organizationId: organization.Id, ageGroup: Age.InfantToddler, time: FundingTime.Part, capacity: 5);
			var infantToddlerFullTimeFundingSpace = CreateFundingSpace(organizationId: organization.Id, ageGroup: Age.InfantToddler, time: FundingTime.Full, capacity: 10);
			// Additional funding space for testing roster display
			// InfantToddler FundingSpace FullTimePartTime Split
			// var infantToddlerPartFullTimeSplitFundingSpace = CreateFundingSpace(organizationId: organization.Id, ageGroup: Age.InfantToddler, time: FundingTime.Full, capacity: 10, split: true, splitTime: FundingTime.Part);
			var preschoolFundingSpace = CreateFundingSpace(organizationId: organization.Id, ageGroup: Age.Preschool, time: FundingTime.Full, capacity: 20);
			// Additional funding space for testing roster display
			// Preschool FundingSpace PartTime
			// CreateFundingSpace(organizationId: organization.Id, ageGroup: Age.Preschool, time: FundingTime.Part, capacity: 5);

			var site = CreateSite(organizationId: organization.Id, name: "Gryffindor Day Care Center");
			var site1 = CreateSite(organizationId: organization.Id, name: "Helga Hufflepuff Day Care");

			var user = CreateUser(wingedKeysId: Guid.Parse("2c0ec653-8829-4aa1-82ba-37c8832bbb88"));

			CreateOrganizationPermission(organizationId: organization.Id, userId: user.Id);

			var reportingPeriods = new ReportingPeriod[] {
				CreateReportingPeriod(period: "2019-07-01", start: "2019-07-01", end: "2019-07-28", due: "2019-08-16"),
				CreateReportingPeriod(period: "2019-08-01", start: "2019-07-29", end: "2019-09-01", due: "2019-09-20"),
				CreateReportingPeriod(period: "2019-09-01", start: "2019-09-02", end: "2019-09-29", due: "2019-10-18"),
				CreateReportingPeriod(period: "2019-10-01", start: "2019-09-30", end: "2019-10-27", due: "2019-11-15"),
				CreateReportingPeriod(period: "2019-11-01", start: "2019-10-28", end: "2019-12-01", due: "2019-12-20"),
				CreateReportingPeriod(period: "2019-12-01", start: "2019-12-02", end: "2019-12-29", due: "2020-01-17"),
				CreateReportingPeriod(period: "2020-01-01", start: "2019-12-30", end: "2020-02-02", due: "2020-02-21"),
				CreateReportingPeriod(period: "2020-02-01", start: "2020-02-03", end: "2020-03-01", due: "2020-03-20"),
				CreateReportingPeriod(period: "2020-03-01", start: "2020-03-02", end: "2020-03-29", due: "2020-04-17"),
				CreateReportingPeriod(period: "2020-04-01", start: "2020-03-30", end: "2020-04-26", due: "2020-05-15"),
				CreateReportingPeriod(period: "2020-05-01", start: "2020-04-27", end: "2020-05-31", due: "2020-06-19"),
				CreateReportingPeriod(period: "2020-06-01", start: "2020-06-01", end: "2020-06-28", due: "2020-07-17"),
				CreateReportingPeriod(period: "2020-07-01", start: "2019-07-01", end: "2019-07-28", due: "2019-08-16"),
				CreateReportingPeriod(period: "2020-08-01", start: "2019-07-29", end: "2019-09-01", due: "2019-09-20"),
				CreateReportingPeriod(period: "2020-09-01", start: "2019-09-02", end: "2019-09-29", due: "2019-10-18"),
				CreateReportingPeriod(period: "2020-10-01", start: "2019-09-30", end: "2019-10-27", due: "2019-11-15"),
				CreateReportingPeriod(period: "2020-11-01", start: "2019-10-28", end: "2019-12-01", due: "2019-12-20"),
				CreateReportingPeriod(period: "2020-12-01", start: "2019-12-02", end: "2019-12-29", due: "2020-01-17"),
				CreateReportingPeriod(period: "2021-01-01", start: "2019-12-30", end: "2020-02-02", due: "2020-02-21"),
				CreateReportingPeriod(period: "2021-02-01", start: "2020-02-03", end: "2020-03-01", due: "2020-03-20"),
				CreateReportingPeriod(period: "2021-03-01", start: "2020-03-02", end: "2020-03-29", due: "2020-04-17"),
				CreateReportingPeriod(period: "2021-04-01", start: "2020-03-30", end: "2020-04-26", due: "2020-05-15"),
				CreateReportingPeriod(period: "2021-05-01", start: "2020-04-27", end: "2020-05-31", due: "2020-06-19"),
				CreateReportingPeriod(period: "2021-06-01", start: "2020-06-01", end: "2020-06-28", due: "2020-07-17"),
				CreateReportingPeriod(period: "2021-07-01", start: "2019-07-01", end: "2019-07-28", due: "2019-08-16"),
				CreateReportingPeriod(period: "2021-08-01", start: "2019-07-29", end: "2019-09-01", due: "2019-09-20"),
				CreateReportingPeriod(period: "2021-09-01", start: "2019-09-02", end: "2019-09-29", due: "2019-10-18"),
				CreateReportingPeriod(period: "2021-10-01", start: "2019-09-30", end: "2019-10-27", due: "2019-11-15"),
				CreateReportingPeriod(period: "2021-11-01", start: "2019-10-28", end: "2019-12-01", due: "2019-12-20"),
				CreateReportingPeriod(period: "2021-12-01", start: "2019-12-02", end: "2019-12-29", due: "2020-01-17"),
				CreateReportingPeriod(period: "2022-01-01", start: "2019-12-30", end: "2020-02-02", due: "2020-02-21"),
				CreateReportingPeriod(period: "2022-02-01", start: "2020-02-03", end: "2020-03-01", due: "2020-03-20"),
				CreateReportingPeriod(period: "2022-03-01", start: "2020-03-02", end: "2020-03-29", due: "2020-04-17"),
				CreateReportingPeriod(period: "2022-04-01", start: "2020-03-30", end: "2020-04-26", due: "2020-05-15"),
				CreateReportingPeriod(period: "2022-05-01", start: "2020-04-27", end: "2020-05-31", due: "2020-06-19"),
				CreateReportingPeriod(period: "2022-06-01", start: "2020-06-01", end: "2020-06-28", due: "2020-07-17")
			};

			CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[0].Id, submittedAt: "2019-09-09");
			CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[1].Id, submittedAt: "2019-10-04");
			CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[2].Id, submittedAt: "2019-11-12");
			CreateCdcReport(organizationId: organization.Id, reportingPeriodId: reportingPeriods[3].Id);

			var lines = new string[] {
				"Alan,Rickman,2018-12-07,Male,TRUE,2019-09-02,,CDC,C4K,FOSTER,ALTERNATE",
				"David,Thewlis,2016-07-29,Male,TRUE,2019-09-02,,CDC,,,",
				"Helena,Bonham Carter,2016-01-01,Female,TRUE,2019-09-02,,,,,",
				"Maggie,smith,2015-02-02,Female,TRUE,2018-09-03,,CDC,,,",
				"Michael,Gambon,2015-07-06,Male,TRUE,2018-09-03,,CDC,,,",
				"Richard,Griffiths,2018-07-02,Male,TRUE,2019-09-02,,CDC,,,",
				"Richard,Harris,2015-12-23,Male,TRUE,2018-09-03,,CDC,,,",
				"Warwick,Davis,2018-11-25,Male,TRUE,2019-09-02,,CDC,,,",
				"Emma,Thompson,2016-08-03,Female,TRUE,2019-09-02,,CDC,,,",
				"Robbie,Coltrane,2017-10-27,Male,TRUE,2019-09-02,,CDC,,,",
				"David,Bradley,2014-11-20,Male,TRUE,2018-09-03,2019-08-30,CDC,C4K,,",
				"John,Cleese,2015-10-21,Male,TRUE,2019-09-02,,,,,",
				"John,Hurt,2018-02-14,Male,TRUE,2019-09-02,,CDC,,,",
				"Kenneth,Branagh,2018-08-19,Male,FALSE,2019-09-02,,CDC2,,,",
				"Miranda,Richardson,2018-11-09,Female,TRUE,2019-09-02,,CDC,,,",
				"Matthew,Lewis,2017-12-07,Male,TRUE,2019-09-02,,,,,",
				"Tom,FELTON,2015-07-29,Male,TRUE,2019-09-02,,CDC,,,",
				"Daniel,Radcliffe,2015-01-01,Male,TRUE,2019-09-02,,CDC,,,",
				"Emma,Watson,2015-03-02,Female,TRUE,2018-09-03,,,,,",
				"Alfred,Enoch,2015-09-06,Male,TRUE,2018-09-03,2019-08-30,CDC,,,",
				"Ralph,Fiennes,2017-07-02,Male,TRUE,2019-09-02,,CDC,,,",
				"James,Phelps,2014-12-23,Male,TRUE,2018-09-03,,,,,",
				"Oliver,Phelps,2017-11-25,Male,TRUE,2019-09-02,,CDC,,,",
				"Bonnie,Wright,2015-08-03,Female,TRUE,2019-09-02,,,C4K,,",
				"Julie,Walters,2016-10-27,Female,TRUE,2019-09-02,,CDC,C4K,,",
				"Chris,Rankin,2014-12-20,Male,FALSE,2018-09-03,2019-08-30,CDC,,,",
				"Rupert,Grint,2015-01-21,Male,TRUE,2019-09-02,,CDC,,,",
				"Robert,Hardy,2017-02-14,Male,TRUE,2019-09-02,,CDC,,,",
				"Jason,Isaacs,2017-08-19,Male,TRUE,2019-09-02,,CDC,C4K,,",
				"Mark,Williams,2017-11-09,Male,TRUE,2019-09-02,,CDC,,,",
				"Timothy,Spall,2016-12-07,Male,TRUE,2019-09-02,,CDC,,,",
				"Katie,Leung,2016-07-29,Female,TRUE,2019-09-02,,CDC,,,",
				"Robert,Pattinson,2015-04-01,Male,TRUE,2019-09-02,,CDC,,,",
				"Evanna,Lynch,2015-02-03,Female,TRUE,2018-09-03,,,C4K,,",
				"Imelda,Staunton,2016-07-06,Female,TRUE,2018-09-03,,CDC,,,",
				"Joshua,Herdman,2016-07-02,Male,TRUE,2019-09-02,,CDC,,,",
				"Ian,Hart,2015-12-02,Male,TRUE,2018-09-03,2019-08-30,CDC,,,",
				"David,Tennant,2017-11-25,Male,TRUE,2019-09-02,,CDC,,,",
				"Devon,Murray,2017-08-03,Male,TRUE,2019-09-02,,CDC,,,",
				"Harry,Melling,2016-10-27,Male,TRUE,2019-09-02,,CDC,,,"
			}.ToList();

			for (int i = 0; i < lines.Count; i++)
			{
				var line = lines[i];
				var cells = line.Split(",");

				var firstName = cells[0];
				var lastName = cells[1];
				var birthdate = cells[2];
				var gender = cells[3] == "Male" ? Gender.Male : Gender.Female;
				var birthCertificateRecorded = cells[4] == "TRUE";
				var entry = cells[5];
				var exit = cells[6] != "" ? cells[6] : null;
				var cdc = cells[7] == "CDC";
				var cdc2 = cells[7] == "CDC2";
				var c4k = cells[8] == "C4K";
				var foster = cells[9] == "FOSTER";
				var alternateSite = cells[10] == "ALTERNATE";

				var family = CreateFamily(organizationId: organization.Id);

				if (foster)
				{
					// Partial determination for a child with a foster family
					CreateFamilyDetermination(familyId: family.Id, income: null);
				}
				else
				{
					CreateFamilyDetermination(familyId: family.Id);
				}

				var child = CreateChild(
					organizationId: organization.Id,
					familyId: family.Id,
					firstName: firstName,
					lastName: lastName,
					birthdate: birthdate,
					gender: gender,
					birthCertificateRecorded: birthCertificateRecorded,
					foster: foster
				);

				var ageGroupCutoff = DateTime.Parse("2017-09-01");

				var enrollmentAgeGroup = DateTime.Parse(birthdate) > ageGroupCutoff ? Age.InfantToddler : Age.Preschool;
				var enrollment = CreateEnrollment(
					childId: child.Id,
					siteId: alternateSite ? site1.Id : site.Id,
					entry: entry,
					exit: exit,
					exitReason: exit != null ? "Other" : null,
					ageGroup: enrollmentAgeGroup,
					author: user
				);

				if (cdc)
				{
					CreateFunding(
						enrollmentId: enrollment.Id,
						isC4K: false,
						source: FundingSource.CDC,
						firstReportingPeriod: entry == "2018-09-03" ? reportingPeriods[14] : reportingPeriods[26],
						lastReportingPeriod: cells[6] != "" ? reportingPeriods[25] : null,
						fundingSpace: enrollmentAgeGroup == Age.InfantToddler ? infantToddlerFullTimeFundingSpace : preschoolFundingSpace
					);
				}

				if (cdc2)
				{
					CreateFunding(
						enrollmentId: enrollment.Id,
						isC4K: false,
						source: FundingSource.CDC,
						firstReportingPeriod: reportingPeriods[30],
						lastReportingPeriod: reportingPeriods[31],
						fundingSpace: enrollmentAgeGroup == Age.InfantToddler ? infantToddlerFullTimeFundingSpace : preschoolFundingSpace
					);

					CreateFunding(
						enrollmentId: enrollment.Id,
						isC4K: false,
						source: FundingSource.CDC,
						firstReportingPeriod: reportingPeriods[33],
						lastReportingPeriod: null,
						fundingSpace: enrollmentAgeGroup == Age.InfantToddler ? infantToddlerFullTimeFundingSpace : preschoolFundingSpace
					);
				}

				if (c4k)
				{
					CreateFunding(
						enrollmentId: enrollment.Id,
						isC4K: true,
						childId: child.Id,
						certificateStartDate: entry,
						certificateEndDate: exit,
						child: child,
						caseNumber: 123456
					);
				}

				if (entry == "2018-09-03" && DateTime.Parse(birthdate) < ageGroupCutoff)
				{
					var firstEnrollment = CreateEnrollment(
					childId: child.Id,
					siteId: site.Id,
					entry: "2017-09-04",
					exit: entry,
					exitReason: "Other",
					ageGroup: Age.InfantToddler
					);

					if (cdc)
					{
						CreateFunding(
							enrollmentId: firstEnrollment.Id,
							isC4K: false,
							source: FundingSource.CDC,
							firstReportingPeriod: reportingPeriods[2],
							lastReportingPeriod: reportingPeriods[13],
							fundingSpace: infantToddlerFullTimeFundingSpace
						);
					}
				}
			}

			// Additional organization for security testing
			var honeyPotOrganization = CreateOrganization(name: "Honey Pot");
			var honeyPotSite = CreateSite(organizationId: honeyPotOrganization.Id, name: "Honey Pot");
			var honeyPotFamily = CreateFamily(organizationId: honeyPotOrganization.Id);
			var honeyPotChild = CreateChild(firstName: "Pooh", lastName: "Bear", organizationId: honeyPotOrganization.Id, familyId: honeyPotFamily.Id);
			var honeyPotEnrollment = CreateEnrollment(childId: honeyPotChild.Id, siteId: honeyPotSite.Id);
			var honeyPotUser = CreateUser(wingedKeysId: Guid.NewGuid(), firstName: "Julia", lastName: "Hogan");
			CreateOrganizationPermission(organizationId: honeyPotOrganization.Id, userId: honeyPotUser.Id);

			CreateFundingSpace(organizationId: honeyPotOrganization.Id, ageGroup: Age.InfantToddler, time: FundingTime.Full, capacity: 10);
		}

		private void DeleteAllData()
		{
			_context.Permissions.RemoveRange(_context.Permissions.ToList());
			_context.FamilyDeterminations.RemoveRange(_context.FamilyDeterminations.ToList());
			_context.Families.RemoveRange(_context.Families.ToList());
			_context.C4KCertificates.RemoveRange(_context.C4KCertificates.ToList());
			_context.Children.RemoveRange(_context.Children.ToList());
			_context.Enrollments.RemoveRange(_context.Enrollments.ToList());
			_context.FundingSpaces.RemoveRange(_context.FundingSpaces.ToList());
			_context.Fundings.RemoveRange(_context.Fundings.ToList());
			_context.ReportingPeriods.RemoveRange(_context.ReportingPeriods.ToList());
			_context.Reports.RemoveRange(_context.Reports.ToList());
			_context.Sites.RemoveRange(_context.Sites.ToList());
			_context.Organizations.RemoveRange(_context.Organizations.ToList());
			_context.Users.RemoveRange(_context.Users.ToList());
		}

		private Organization CreateOrganization(string name = "Hogwarts")
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
			int capacity = 10,
			bool split = false,
			FundingTime splitTime = FundingTime.Part
		)
		{
			var allocations = new List<FundingTimeAllocation>();
			if (split)
			{
				allocations = new List<FundingTimeAllocation>{
					new FundingTimeAllocation{
						Time = time,
						Weeks = 50
					},
					new FundingTimeAllocation{
						Time = splitTime,
						Weeks = 2
					}
				};
			}
			else
			{
				allocations = new List<FundingTimeAllocation>{
					new FundingTimeAllocation{
						Time = time,
						Weeks = 52
					}
				};
			}
			var space = new FundingSpace
			{
				OrganizationId = organizationId,
				Source = source,
				AgeGroup = ageGroup,
				Capacity = capacity,
				FundingTimeAllocations = allocations
			};
			_context.FundingSpaces.Add(space);
			_context.SaveChanges();
			return space;
		}

		private Site CreateSite(
			int organizationId,
			string name = "Hogwarts",
			Region region = Region.East
		)
		{
			var site = new Hedwig.Models.Site
			{
				OrganizationId = organizationId,
				Name = name,
				Region = region
			};
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

		private Family CreateFamily(
			int organizationId,
			string addressLine1 = "450 Columbus Blvd.",
			string town = "Hartford",
			string state = "CT",
			string zip = "06103"
		)
		{
			var family = new Family
			{
				OrganizationId = organizationId,
				AddressLine1 = addressLine1,
				Town = town,
				State = state,
				Zip = zip
			};
			_context.Families.Add(family);
			_context.SaveChanges();
			return family;
		}

		private FamilyDetermination CreateFamilyDetermination(
			int familyId,
			int numberOfPeople = 3,
			decimal? income = 20000M,
			string determined = "2019-08-01"
		)
		{
			var familyDetermination = new FamilyDetermination
			{
				FamilyId = familyId,
				NumberOfPeople = numberOfPeople,
				Income = income,
				DeterminationDate = DateTime.Parse(determined)
			};
			_context.FamilyDeterminations.Add(familyDetermination);
			_context.SaveChanges();
			return familyDetermination;
		}

		private Child CreateChild(
			int organizationId,
			int familyId = 0,
			string firstName = "John",
			string lastName = "Doe",
			string birthdate = "2016-06-01",
			Gender gender = Gender.Unspecified,
			bool birthCertificateRecorded = true,
			bool foster = false
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
				HispanicOrLatinxEthnicity = randomIsHispanic,
				Foster = foster
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
			string exitReason = null,
			Age ageGroup = Age.Preschool,
			User author = null
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
				enrollment.ExitReason = exitReason;
			}

			if (author != null)
			{
				enrollment.UpdateTemporalInfo(author.Id, DateTime.Now);
			}

			_context.Enrollments.Add(enrollment);
			_context.SaveChanges();
			return enrollment;
		}

		private object CreateFunding(
			int enrollmentId,
			bool isC4K,
			Guid? childId = null,
			Child child = null,
			int? caseNumber = null,
			string certificateStartDate = null,
			string certificateEndDate = null,
			FundingSource? source = FundingSource.CDC,
			ReportingPeriod firstReportingPeriod = null,
			ReportingPeriod lastReportingPeriod = null,
			FundingSpace fundingSpace = null
		)
		{
			if (isC4K)
			{
				C4KCertificate funding;
				var random = new Random();
				if (certificateEndDate == null)
				{
					funding = new C4KCertificate
					{
						ChildId = (Guid)childId,
						StartDate = DateTime.Parse(certificateStartDate),
						EndDate = null,
					};
					child.C4KFamilyCaseNumber = caseNumber ?? (new Random()).Next(1, 9999);
				}
				else
				{
					funding = new C4KCertificate
					{
						ChildId = (Guid)childId,
						StartDate = DateTime.Parse(certificateStartDate),
						EndDate = DateTime.Parse(certificateEndDate),
					};
				}

				_context.C4KCertificates.Add(funding);
				_context.SaveChanges();
				return funding;
			}
			else
			{
				var funding = new Funding
				{
					EnrollmentId = enrollmentId,
					Source = source,
					FirstReportingPeriodId = firstReportingPeriod != null ? firstReportingPeriod.Id : null as int?,
					LastReportingPeriodId = lastReportingPeriod != null ? lastReportingPeriod.Id : null as int?,
					FundingSpaceId = fundingSpace != null ? fundingSpace.Id : null as int?
				};
				_context.Fundings.Add(funding);
				_context.SaveChanges();
				return funding;
			}
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
