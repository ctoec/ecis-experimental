using Xunit;
using System.Threading.Tasks;
using System;
using System.Linq;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Schema;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Integration.GraphQLMutations
{
	public class ChildMutationTests
	{
		[Fact]
		public async Task Create_Child_With_All_Fields()
		{
			using (var api = new TestApiProvider()) {
				// If
				var site = SiteHelper.CreateSite(api.Context);
				var firstName = "David";
				var middleName = "Harry";
				var lastName = "Radcliff";
				var suffix = "Jr.";
				var birthdate = new DateTime(2010, 1, 1, 0, 0, 0);
				var birthCertificateId = "12345";
				var birthTown = "Here";
				var birthState = "There";
				var gender = Gender.Male;
				var americanIndianOrAlaskaNative = false;
				var asian = false;
				var blackOrAfricanAmerican = true;
				var nativeHawaiianOrPacificIslander = false;
				var white = true;
				var hispanicOrLatinxEthnicity = false;
				var foster = false;

				// When

				// Issue properly serializing boolean values, hence why false/true is hardcoded
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						createChildWithSiteEnrollment (
							firstName: ""{firstName}"",
							middleName: ""{middleName}"",
							lastName: ""{lastName}"",
							suffix: ""{suffix}"",
							birthdate: ""{birthdate}"",
							birthCertificateId: ""{birthCertificateId}"",
							birthTown: ""{birthTown}"",
							birthState: ""{birthState}"",
							gender: {gender},
							americanIndianOrAlaskaNative: false,
							asian: false,
							blackOrAfricanAmerican: true,
							nativeHawaiianOrPacificIslander: false,
							white: true,
							hispanicOrLatinxEthnicity: false,
							foster: false,
							siteId: {site.Id}
						) {{
								firstName
								middleName
								lastName
								suffix
								birthdate
								birthCertificateId
								birthTown
								birthState
								gender
								americanIndianOrAlaskaNative
								asian
								blackOrAfricanAmerican
								nativeHawaiianOrPacificIslander
								white
								hispanicOrLatinxEthnicity
								foster
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Child child = await response.GetObjectFromGraphQLResponse<Child>("createChildWithSiteEnrollment");
				Assert.Equal(firstName, child.FirstName);
				Assert.Equal(middleName, child.MiddleName);
				Assert.Equal(lastName, child.LastName);
				Assert.Equal(suffix, child.Suffix);
				Assert.Equal(birthdate, child.Birthdate);
				Assert.Equal(birthCertificateId, child.BirthCertificateId);
				Assert.Equal(birthTown, child.BirthTown);
				Assert.Equal(birthState, child.BirthState);
				Assert.Equal(gender, child.Gender);
				Assert.Equal(americanIndianOrAlaskaNative, child.AmericanIndianOrAlaskaNative);
				Assert.Equal(asian, child.Asian);
				Assert.Equal(blackOrAfricanAmerican, child.BlackOrAfricanAmerican);
				Assert.Equal(nativeHawaiianOrPacificIslander, child.NativeHawaiianOrPacificIslander);
				Assert.Equal(white, child.White);
				Assert.Equal(hispanicOrLatinxEthnicity, child.HispanicOrLatinxEthnicity);
				Assert.Equal(foster, child.Foster);
			}
		}

		[Fact]
		public async Task Create_Child_With_Partial_Fields()
		{
			using (var api = new TestApiProvider()) {
				// If
				var site = SiteHelper.CreateSite(api.Context);
				var firstName = "David";
				var middleName = "Harry";
				var lastName = "Radcliff";

				// When

				// Issue properly serializing boolean values, hence why false/true is hardcoded
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						createChildWithSiteEnrollment (
							firstName: ""{firstName}"",
							middleName: ""{middleName}"",
							lastName: ""{lastName}"",
							siteId: {site.Id}
						) {{
								firstName
								middleName
								lastName
								suffix
								birthdate
								birthCertificateId
								birthTown
								birthState
								gender
								americanIndianOrAlaskaNative
								asian
								blackOrAfricanAmerican
								nativeHawaiianOrPacificIslander
								white
								hispanicOrLatinxEthnicity
								foster
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Child child = await response.GetObjectFromGraphQLResponse<Child>("createChildWithSiteEnrollment");
				Assert.Equal(firstName, child.FirstName);
				Assert.Equal(middleName, child.MiddleName);
				Assert.Equal(lastName, child.LastName);
				Assert.Null(child.Suffix);
				Assert.Null(child.Birthdate);
				Assert.Null(child.BirthCertificateId);
				Assert.Null(child.BirthTown);
				Assert.Null(child.BirthState);
				Assert.Null(child.Gender);
				Assert.False(child.AmericanIndianOrAlaskaNative);
				Assert.False(child.Asian);
				Assert.False(child.BlackOrAfricanAmerican);
				Assert.False(child.NativeHawaiianOrPacificIslander);
				Assert.False(child.White);
				Assert.False(child.HispanicOrLatinxEthnicity);
				Assert.False(child.Foster);
			}
		}

		[Fact]
		public async Task Create_Child_Site_Id_Not_Found()
		{
			using (var api = new TestApiProvider()) {
				// If
				var invalidId = 0;

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						createChildWithSiteEnrollment (
							firstName: ""Name"",
							middleName: ""Middle"",
							lastName: ""Last"",
							siteId: {invalidId}
						) {{
							firstName
							middleName
							lastName
						}}
					}}"
				);

				// Then
				var gqlResponse = await response.ParseGraphQLResponse();
				Assert.NotEmpty(gqlResponse.Errors);
				Assert.Equal(AppErrorMessages.NOT_FOUND("Site", invalidId.ToString()), gqlResponse.Errors[0].Message);
			}
		}

		[Fact]
		public async Task Update_Child_With_All_Fields()
		{
			using (var api = new TestApiProvider()) {
				// If
				var child = ChildHelper.CreateChild(api.Context);
				var firstName = "David";
				var middleName = "Harry";
				var lastName = "Radcliff";
				var suffix = "Jr.";
				var birthdate = new DateTime(2010, 1, 1, 0, 0, 0);
				var birthCertificateId = "12345";
				var birthTown = "Here";
				var birthState = "There";
				var gender = Gender.Male;
				var americanIndianOrAlaskaNative = false;
				var asian = false;
				var blackOrAfricanAmerican = true;
				var nativeHawaiianOrPacificIslander = false;
				var white = true;
				var hispanicOrLatinxEthnicity = false;
				var foster = false;

				// When

				// Issue properly serializing boolean values, hence why false/true is hardcoded
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateChild (
							id: ""{child.Id}"",
							firstName: ""{firstName}"",
							middleName: ""{middleName}"",
							lastName: ""{lastName}"",
							suffix: ""{suffix}"",
							birthdate: ""{birthdate}"",
							birthCertificateId: ""{birthCertificateId}"",
							birthTown: ""{birthTown}"",
							birthState: ""{birthState}"",
							gender: {gender},
							americanIndianOrAlaskaNative: false,
							asian: false,
							blackOrAfricanAmerican: true,
							nativeHawaiianOrPacificIslander: false,
							white: true,
							hispanicOrLatinxEthnicity: false,
							foster: false
						) {{
								firstName
								middleName
								lastName
								suffix
								birthdate
								birthCertificateId
								birthTown
								birthState
								gender
								americanIndianOrAlaskaNative
								asian
								blackOrAfricanAmerican
								nativeHawaiianOrPacificIslander
								white
								hispanicOrLatinxEthnicity
								foster
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Child updated = await response.GetObjectFromGraphQLResponse<Child>("updateChild");
				Assert.Equal(firstName, updated.FirstName);
				Assert.Equal(middleName, updated.MiddleName);
				Assert.Equal(lastName, updated.LastName);
				Assert.Equal(suffix, updated.Suffix);
				Assert.Equal(birthdate, updated.Birthdate);
				Assert.Equal(birthCertificateId, updated.BirthCertificateId);
				Assert.Equal(birthTown, updated.BirthTown);
				Assert.Equal(birthState, updated.BirthState);
				Assert.Equal(gender, updated.Gender);
				Assert.Equal(americanIndianOrAlaskaNative, updated.AmericanIndianOrAlaskaNative);
				Assert.Equal(asian, updated.Asian);
				Assert.Equal(blackOrAfricanAmerican, updated.BlackOrAfricanAmerican);
				Assert.Equal(nativeHawaiianOrPacificIslander, updated.NativeHawaiianOrPacificIslander);
				Assert.Equal(white, updated.White);
				Assert.Equal(hispanicOrLatinxEthnicity, updated.HispanicOrLatinxEthnicity);
				Assert.Equal(foster, updated.Foster);
			}
		}

		[Fact]
		public async Task Update_Child_With_Partial_Fields_No_Clearing()
		{
			using (var api = new TestApiProvider()) {
				// If
				var child = ChildHelper.CreateChild(api.Context);
				var firstName = "Roger";

				// When

				// Issue properly serializing boolean values, hence why false/true is hardcoded
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateChild (
							id: ""{child.Id}"",
							firstName: ""{firstName}""
						) {{
								firstName
								middleName
								lastName
								suffix
								birthdate
								birthCertificateId
								birthTown
								birthState
								gender
								americanIndianOrAlaskaNative
								asian
								blackOrAfricanAmerican
								nativeHawaiianOrPacificIslander
								white
								hispanicOrLatinxEthnicity
								foster
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Child updated = await response.GetObjectFromGraphQLResponse<Child>("updateChild");
				Assert.Equal(firstName, updated.FirstName);
				Assert.Equal(child.MiddleName, updated.MiddleName);
				Assert.Equal(child.LastName, updated.LastName);
				Assert.Equal(child.Suffix, updated.Suffix);
				Assert.Equal(child.Birthdate, updated.Birthdate);
				Assert.Equal(child.BirthCertificateId, updated.BirthCertificateId);
				Assert.Equal(child.BirthTown, updated.BirthTown);
				Assert.Equal(child.BirthState, updated.BirthState);
				Assert.Equal(child.Gender, updated.Gender);
				Assert.Equal(child.AmericanIndianOrAlaskaNative, updated.AmericanIndianOrAlaskaNative);
				Assert.Equal(child.Asian, updated.Asian);
				Assert.Equal(child.BlackOrAfricanAmerican, updated.BlackOrAfricanAmerican);
				Assert.Equal(child.NativeHawaiianOrPacificIslander, updated.NativeHawaiianOrPacificIslander);
				Assert.Equal(child.White, updated.White);
				Assert.Equal(child.HispanicOrLatinxEthnicity, updated.HispanicOrLatinxEthnicity);
				Assert.Equal(child.Foster, updated.Foster);
			}
		}

		[Fact]
		public async Task Update_Child_With_Partial_Fields_With_Clearing()
		{
			using (var api = new TestApiProvider()) {
				// If
				var child = ChildHelper.CreateChild(api.Context);
				var firstName = "Roger";
				var birthdate = "null";

				// When

				// Issue properly serializing boolean values, hence why false/true is hardcoded
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateChild (
							id: ""{child.Id}"",
							firstName: ""{firstName}"",
							birthdate: ""{birthdate}""
						) {{
								firstName
								middleName
								lastName
								suffix
								birthdate
								birthCertificateId
								birthTown
								birthState
								gender
								americanIndianOrAlaskaNative
								asian
								blackOrAfricanAmerican
								nativeHawaiianOrPacificIslander
								white
								hispanicOrLatinxEthnicity
								foster
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Child updated = await response.GetObjectFromGraphQLResponse<Child>("updateChild");
				Assert.Equal(firstName, updated.FirstName);
				Assert.Equal(child.MiddleName, updated.MiddleName);
				Assert.Equal(child.LastName, updated.LastName);
				Assert.Equal(child.Suffix, updated.Suffix);
				Assert.Null(updated.Birthdate);
				Assert.Equal(child.BirthCertificateId, updated.BirthCertificateId);
				Assert.Equal(child.BirthTown, updated.BirthTown);
				Assert.Equal(child.BirthState, updated.BirthState);
				Assert.Equal(child.Gender, updated.Gender);
				Assert.Equal(child.AmericanIndianOrAlaskaNative, updated.AmericanIndianOrAlaskaNative);
				Assert.Equal(child.Asian, updated.Asian);
				Assert.Equal(child.BlackOrAfricanAmerican, updated.BlackOrAfricanAmerican);
				Assert.Equal(child.NativeHawaiianOrPacificIslander, updated.NativeHawaiianOrPacificIslander);
				Assert.Equal(child.White, updated.White);
				Assert.Equal(child.HispanicOrLatinxEthnicity, updated.HispanicOrLatinxEthnicity);
				Assert.Equal(child.Foster, updated.Foster);
			}
		}

		[Fact]
		public async Task Update_Child_Id_Not_Found()
		{
			using (var api = new TestApiProvider()) {
				// If
				var childId = Guid.Empty;

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateChild (
							id: ""{childId}""
						) {{
							firstName
						}}
					}}"
				);

				// Then
				var gqlResponse = await response.ParseGraphQLResponse();
				Assert.NotEmpty(gqlResponse.Errors);		
				Assert.Equal(AppErrorMessages.NOT_FOUND("Child", childId.ToString()), gqlResponse.Errors[0].Message);
			}
		}
	}
}