using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using GraphQL.Common.Response;

namespace HedwigTests.Fixtures
{
    public static class TestHttpResponseMessageExtensions
    {
        public static async Task<T> ParseGraphQLResponse<T>(this HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();
            if(TestEnvironmentFlags.ShouldLogHTTP()) {
                Console.WriteLine(content);
            }
            GraphQLResponse graphQLResponse = JsonConvert.DeserializeObject<GraphQLResponse>(content);
            if (graphQLResponse.Errors != null) {
                throw new Exception($"GraphQL Error: {graphQLResponse.Errors[0].Message}");
            }
            var typeName = typeof(T).Name;
            var fieldName = ToCamelCase(typeName);
            return graphQLResponse.GetDataFieldAs<T>(fieldName);
        }

        private static String ToCamelCase(String str) {
            return Char.ToLowerInvariant(str[0]) + str.Substring(1);
        }
    }
}