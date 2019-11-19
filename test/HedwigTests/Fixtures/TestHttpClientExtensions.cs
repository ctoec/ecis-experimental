// GraphQL File
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace HedwigTests.Fixtures
{
    public static class TestHttpClientExtensions
    {
        public static Task<HttpResponseMessage> GetGraphQLAsync(this HttpClient client, string query)
        {
            return client.GetAsync($"/graphql?query={query}");
        }
        public static Task<HttpResponseMessage> PostGraphQLAsync(this HttpClient client, string query)
        {
            var content = JsonConvert.SerializeObject(new { query = query});
            return client.PostAsync("/graphql", new StringContent(content, Encoding.UTF8, "application/json"));
        }
    }
}