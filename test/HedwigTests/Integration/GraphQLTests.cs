using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Threading;
using Xunit;
using Hedwig.Data;
using Hedwig.Models;
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
				var response = await client.GetGraphQLAsync(
					$@"{{
						user (id: {userId} ) {{
							firstName
						}}
					}}"
				);

				response.EnsureSuccessStatusCode();
				User user = await response.ParseGraphQLResponse<User>("user");
				Assert.Equal(UserHelper.FIRST_NAME, user.FirstName);
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
                var  response = await client.GetGraphQLAsync(
					$@"{{
						enrollment(id: {enrollmentId}) {{
							entry
						}}
					}}"
				);
                response.EnsureSuccessStatusCode();
				Enrollment enrollment = await response.ParseGraphQLResponse<Enrollment>("enrollment");
                Assert.Equal(EnrollmentHelper.ENTRY_STR, enrollment.Entry.ToString("yyyy-MM-dd"));
            }

        }

		[Fact]
		public async Task GraphQL_Query_Child_By_Id_As_Of()
		{
			Guid? childId = null;
			DateTime? asOf = null;
			string updatedName = "UPDATED";
			void seedData(HedwigContext context) {
				var child = ChildHelper.CreateChild(context);
				childId = child.Id;
				asOf = Utilities.GetAsOfWithSleep();
				child.FirstName = updatedName;
				context.SaveChanges();
			}

			using (var client = new TestClientProvider(seedData).Client) {
				HttpResponseMessage responseCurrent = await client.GetGraphQLAsync(
					$@"{{
						child(id: ""{childId.Value}"") {{
							firstName
						}}
					}}"
				);

				responseCurrent.EnsureSuccessStatusCode();
				Child childCurrent = await responseCurrent.ParseGraphQLResponse<Child>("child");
				Assert.Equal(updatedName, childCurrent.FirstName);

				HttpResponseMessage responseAsOf = await client.GetGraphQLAsync(
					$@"{{
						child(id: ""{childId.Value}"", asOf: ""{asOf.Value}"") {{
							firstName
						}}
					}}"
				);
				
				responseAsOf.EnsureSuccessStatusCode();
				Child childAsOf = await responseAsOf.ParseGraphQLResponse<Child>("child");
				Assert.Equal(ChildHelper.FIRST_NAME, childAsOf.FirstName);
			}
		}
    }
}
