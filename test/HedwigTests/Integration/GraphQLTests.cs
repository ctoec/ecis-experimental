using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Data;
using HedwigTests.Helpers;

namespace HedwigTests.Integration
{
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
            void seedData(HedwigContext context) {
                UserHelper.CreateUser(context);
            }
            using (var client = new TestClientProvider(seedData).Client) {
                HttpResponseMessage response = await client.GetAsync("/graphql?query={user(id:1){firstName}}");
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                JObject user = JsonConvert.DeserializeObject<JObject>(content);
                Assert.Equal(UserHelper.FIRST_NAME, user["data"]["user"]["firstName"]);
            }
        }

        [Fact]
        public async Task GraphQL_Query_Enrollment_By_Id()
        {
            void seedData(HedwigContext context) {
                EnrollmentHelper.CreateEnrollment(context);
            }
            using (var client = new TestClientProvider(seedData).Client) {
                HttpResponseMessage  response = await client.GetAsync("/graphql?query={enrollment(id: 1){entry}}");
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                JObject enrollment = JsonConvert.DeserializeObject<JObject>(content);
                Assert.Equal(EnrollmentHelper.ENTRY_STR, enrollment["data"]["enrollment"]["entry"]);
            }

        }
    }
}
