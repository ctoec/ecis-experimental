using System.Threading.Tasks;
using Xunit;
using HedwigTests.Fixtures;

namespace HedwigTests.Integration
{
    public class GraphQLTests
    {
        [Fact]
        public async Task GraphQL_Exists()
        {
			using (var client = new TestApiProvider().Client) {
                var response = await client.GetAsync("/graphql");
                response.EnsureSuccessStatusCode();
            }
        }
	}
}
