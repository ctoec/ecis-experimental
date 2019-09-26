using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Data;
using HedwigTests.Helpers;

namespace HedwigTests.Integration
{
	[Collection("SqlServer")]
	public class GraphQLTests
	{
		[Fact]
		public async Task GraphQL_Exists()
		{
			using (var client = new TestClientProvider().Client) {
				HttpResponseMessage response = await client.GetAsync("/graphql");
				response.EnsureSuccessStatusCode();
			}
		}

		[Fact]
		public async Task GraphQL_Query_User_By_Id()
		{
			int? userId = null;
			void seedData(HedwigContext context) {
				var user = UserHelper.CreateUser(context);
				userId = user.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				HttpResponseMessage response = await client.GetAsync("/graphql?query={user(id: " + userId + "){firstName}}");
				response.EnsureSuccessStatusCode();
				var content = await response.Content.ReadAsStringAsync();
				JObject user = JsonConvert.DeserializeObject<JObject>(content);
				Assert.Equal(UserHelper.FIRST_NAME, user["data"]["user"]["firstName"]);
			}
		}

		[Fact]
		public async Task GraphQL_Query_Enrollment_By_Id()
		{
			int? enrollmentId = null;
			void seedData(HedwigContext context) {
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				enrollmentId = enrollment.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				HttpResponseMessage  response = await client.GetAsync("/graphql?query={enrollment(id: " + enrollmentId + "){entry}}");
				response.EnsureSuccessStatusCode();
				var content = await response.Content.ReadAsStringAsync();
				JObject enrollment = JsonConvert.DeserializeObject<JObject>(content);
				Assert.Equal(EnrollmentHelper.ENTRY_STR, (string)enrollment["data"]["enrollment"]["entry"]);
			}
		}

		[Fact]
		public async Task GraphQL_Query_Sites_With_Enrollments_By_Id()
		{
			int? userId = null;
			void seedData(HedwigContext context) {
				var user = UserHelper.CreateUser(context);
				var sitePermission = SitePermissionHelper.CreateSitePermissionWithUserId(context, user.Id);
				EnrollmentHelper.CreateEnrollmentWithSiteId(context, sitePermission.SiteId);
				userId = user.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				HttpResponseMessage  response = await client.GetAsync("/graphql?query={user(id: " + userId + "){sites{enrollments{entry}}}}");
				response.EnsureSuccessStatusCode();
				var content = await response.Content.ReadAsStringAsync();
				JObject enrollment = JsonConvert.DeserializeObject<JObject>(content);
				Assert.Equal(EnrollmentHelper.ENTRY_STR, enrollment["data"]["user"]["sites"][0]["enrollments"][0]["entry"]);
			}
		}

		[Fact]
		public async Task GraphQL_Query_Sites_With_Enrollments_Filtered_By_Dates_By_Id()
		{
			int? userId = null;
			void seedData(HedwigContext context) {
				var user = UserHelper.CreateUser(context);
				var sitePermission = SitePermissionHelper.CreateSitePermissionWithUserId(context, user.Id);
				var enrollment = EnrollmentHelper.CreateEnrollmentWithSiteId(context, sitePermission.SiteId);
				enrollment.Entry = new DateTime(2019, 1, 1, 0, 0, 0);
				enrollment.Exit = null;
				context.SaveChanges();
				userId = user.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				HttpResponseMessage  response = await client.GetAsync("/graphql?query={user(id: " + userId + "){sites{enrollments(from: \"2018-01-01\" to: \"2020-01-01\"){entry exit}}}}");
				response.EnsureSuccessStatusCode();
				var content = await response.Content.ReadAsStringAsync();
				JObject enrollment = JsonConvert.DeserializeObject<JObject>(content);
				Assert.Equal("2019-01-01", enrollment["data"]["user"]["sites"][0]["enrollments"][0]["entry"]);
				Assert.Equal(JTokenType.Null, enrollment["data"]["user"]["sites"][0]["enrollments"][0]["exit"].Type);
			}
		}

		[Fact]
		public async Task GraphQL_Query_Sites_With_Enrollments_Filtered_By_Dates_By_Id_No_Match()
		{
			int? userId = null;
			void seedData(HedwigContext context) {
				var user = UserHelper.CreateUser(context);
				var sitePermission = SitePermissionHelper.CreateSitePermissionWithUserId(context, user.Id);
				var enrollment = EnrollmentHelper.CreateEnrollmentWithSiteId(context, sitePermission.SiteId);
				enrollment.Entry = new DateTime(2021, 1, 1, 0, 0, 0);
				enrollment.Exit = null;
				context.SaveChanges();
				userId = user.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				HttpResponseMessage  response = await client.GetAsync("/graphql?query={user(id: " + userId + "){sites{enrollments(from: \"2018-01-01\" to: \"2020-01-01\"){entry exit}}}}");
				response.EnsureSuccessStatusCode();
				var content = await response.Content.ReadAsStringAsync();
				JObject enrollment = JsonConvert.DeserializeObject<JObject>(content);
				Assert.Empty(enrollment["data"]["user"]["sites"][0]["enrollments"]);
			}
		}
	}
}
