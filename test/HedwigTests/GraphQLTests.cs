using System;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace HedwigTests
{
    public class GraphQLTest
    {
        [Fact]
        public async Task Test1()
        {
			using (var client = new TestClientProvider().Client) {
				HttpResponseMessage response = await client.GetAsync("/graphql");
                Console.WriteLine("FOO");
				Console.WriteLine(response.StatusCode);
				Assert.Equal(1, 1);
			}
        }
    }
}
