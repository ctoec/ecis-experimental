using System;
using System.Threading.Tasks;
using System.Linq;
using Xunit;
using Hedwig.Data;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Integration.GraphQLQueries
{
	[Collection("SqlServer")]
	public class UserQueryTests
	{

		[Fact]
		public async Task Get_User_By_Id()
		{
			using (var api = new TestApiProvider())
			{
				// Given
				var firstName = "FIRSTNAME";
				var user = UserHelper.CreateUser(api.Context, firstNameOverride: firstName);
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						user (id: {user.Id} ) {{
							firstName
						}}
					}}"
				);

				response.EnsureSuccessStatusCode();
				User userRes = await response.ParseGraphQLResponse<User>();
				Assert.Equal(firstName, userRes.FirstName);
			}
		}

		[Fact]
		public async Task Get_Sites_With_Enrollments_Filtered_By_Dates_By_Id()
		{
			using (var api = new TestApiProvider())
			{
				// Given
				var user = UserHelper.CreateUser(api.Context);
				var sitePermission = SitePermissionHelper.CreateSitePermission(api.Context, user: user);
				var enrollment = EnrollmentHelper.CreateEnrollmentWithSiteId(api.Context, sitePermission.SiteId);
				var entry = new DateTime(2019, 1, 1);
				enrollment.Entry = entry;
				api.Context.SaveChanges();


				// When
				var response = await api.Client.GetGraphQLAsync(
										$@"{{
                        user(id: ""{user.Id}"") {{
                            sites {{
                                enrollments(from:""{entry.AddYears(-1)}"", to: ""{entry.AddYears(1)}"") {{
                                    id
                                }}
                            }}
                        }}
                    }}"
								);


				response.EnsureSuccessStatusCode();
				User userRes = await response.ParseGraphQLResponse<User>();
				Assert.Single(userRes.Sites);
				Assert.Single(userRes.Sites.First().Enrollments);
				Assert.Equal(enrollment.Id, userRes.Sites.First().Enrollments.First().Id);
			}
		}

		[Fact]
		public async Task Get_Sites_With_Enrollments_Filtered_By_Dates_By_Id_No_Match()
		{
			using (var api = new TestApiProvider())
			{
				// Given
				var user = UserHelper.CreateUser(api.Context);
				var sitePermission = SitePermissionHelper.CreateSitePermission(api.Context, user: user);
				var enrollment = EnrollmentHelper.CreateEnrollmentWithSiteId(api.Context, sitePermission.SiteId);
				var entry = new DateTime(2021, 1, 1);
				enrollment.Entry = entry;


				var response = await api.Client.GetGraphQLAsync(
										$@"{{
                        user(id: {user.Id}) {{
                            sites {{
                                enrollments (from: ""{entry.AddYears(-3)}"", to: ""{entry.AddYears(-1)}"") {{
                                    id
                                }}
                            }}
                        }}
                    }}"
								);
				response.EnsureSuccessStatusCode();
				User userRes = await response.ParseGraphQLResponse<User>();
				Assert.Single(userRes.Sites);
				Assert.Empty(userRes.Sites.First().Enrollments);
			}
		}
	}
}