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

        public async Task UserContext_Does_Not_Persist()
        {
            using (var client = new TestClientProvider().Client) {
                var response = await client.GetGraphQLAsync(
                    $@"{{

                    }}"
                );
            }
        }
	}
}
