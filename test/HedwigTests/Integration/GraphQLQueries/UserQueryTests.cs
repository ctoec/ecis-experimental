using System;
using System.Threading.Tasks;
using System.Linq;
using Xunit;
using Hedwig.Data;
using Hedwig.Models;
using HedwigTests.Helpers;

namespace HedwigTests.Integration.GraphQLQueries
{
    [Collection("SqlServer")]
    public class UserQueryTests
    {

    [Fact]
        public async Task Get_User_By_Id()
        {
			int? userId = null;
            string firstName = "FIRSTNAME";
            void seedData(HedwigContext context) {
                var user = UserHelper.CreateUser(context, firstNameOverride: firstName);
				userId = user.Id;
            }
            using (var client = new TestClientProvider(seedData).Client) {
				var response = await client.GetGraphQLAsync(
					$@"{{
						user (id: {userId} ) {{
							firstName
						}}
					}}"
				);

				response.EnsureSuccessStatusCode();
				User user = await response.ParseGraphQLResponse<User>();
				Assert.Equal(firstName, user.FirstName);
            }
        }

		[Fact]
		public async Task GraphQL_Query_Sites_With_Enrollments_By_Id()
		{
			int? userId = null;
            int? enrollmentId = null;
			void seedData(HedwigContext context) {
				var user = UserHelper.CreateUser(context);
				var sitePermission = SitePermissionHelper.CreateSitePermissionWithUserId(context, user.Id);
				var enrollment = EnrollmentHelper.CreateEnrollmentWithSiteId(context, sitePermission.SiteId);
                enrollmentId = enrollment.Id;
				userId = user.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				var  response = await client.GetGraphQLAsync(
                    $@"{{
                        user(id: ""{userId}"") {{
                            sites {{
                                enrollments {{
                                    id
                                }}
                            }}
                        }}
                    }}");
				response.EnsureSuccessStatusCode();
                User user = await response.ParseGraphQLResponse<User>();
                Assert.Single(user.Sites);
                Assert.Single(user.Sites.First().Enrollments);
                Assert.Equal(enrollmentId, user.Sites.First().Enrollments.First().Id);
			}
		}

		[Fact]
		public async Task Get_Sites_With_Enrollments_Filtered_By_Dates_By_Id()
		{
			int? userId = null;
            int? enrollmentId = null;
            DateTime entry = new DateTime(2019, 1, 1);
			void seedData(HedwigContext context) {
				var user = UserHelper.CreateUser(context);
				var sitePermission = SitePermissionHelper.CreateSitePermissionWithUserId(context, user.Id);
				var enrollment = EnrollmentHelper.CreateEnrollmentWithSiteId(context, sitePermission.SiteId);
                enrollmentId = enrollment.Id;
				enrollment.Entry = entry;
				context.SaveChanges();
				userId = user.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				var response = await client.GetGraphQLAsync(
                    $@"{{
                        user(id: ""{userId}"") {{
                            sites {{
                                enrollments(from:""{entry.AddYears(-1)}"", to: ""{entry.AddYears(1)}"") {{
                                    id
                                }}
                            }}
                        }}
                    }}"
                );
                
                
				response.EnsureSuccessStatusCode();
                User user = await response.ParseGraphQLResponse<User>();
                Assert.Single(user.Sites);
                Assert.Single(user.Sites.First().Enrollments);
				Assert.Equal(enrollmentId, user.Sites.First().Enrollments.First().Id);
			}
		}

		[Fact]
		public async Task Get_Sites_With_Enrollments_Filtered_By_Dates_By_Id_No_Match()
		{
			int? userId = null;
            int? enrollmentId  = null;
            DateTime entry = new DateTime(2021, 1, 1);
			void seedData(HedwigContext context) {
				var user = UserHelper.CreateUser(context);
				var sitePermission = SitePermissionHelper.CreateSitePermissionWithUserId(context, user.Id);
				var enrollment = EnrollmentHelper.CreateEnrollmentWithSiteId(context, sitePermission.SiteId);
                enrollmentId = enrollment.Id;
				enrollment.Entry = entry;
				context.SaveChanges();
				userId = user.Id;
			}
			using (var client = new TestClientProvider(seedData).Client) {
				var response = await client.GetGraphQLAsync(
                    $@"{{
                        user(id: {userId}) {{
                            sites {{
                                enrollments (from: ""{entry.AddYears(-3)}"", to: ""{entry.AddYears(-1)}"") {{
                                    id
                                }}
                            }}
                        }}
                    }}"
                );
				response.EnsureSuccessStatusCode();
                User user= await response.ParseGraphQLResponse<User>();
                Assert.Single(user.Sites);
                Assert.Empty(user.Sites.First().Enrollments);
            }
		}
    }
}