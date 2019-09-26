using System;
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
	}
}
