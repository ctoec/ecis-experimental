using System.Threading.Tasks;
using Xunit;

namespace HedwigTests.Integration
{
    public class GraphQLTests
    {
        [Fact]
        public async Task GraphQL_Exists()
        {
			using (var client = new TestClientProvider().Client) {
                var response = await client.GetAsync("/graphql");
                response.EnsureSuccessStatusCode();
            }
        }
	}
}
