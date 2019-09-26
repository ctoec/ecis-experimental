using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace HedwigTests
{
    public static class TestHttpClientExtensions
    {
        public static Task<HttpResponseMessage> GetGraphQLAsync(this HttpClient client, string query)
        {
            return client.GetAsync($"/graphql?query={query}");
        }
    }
}