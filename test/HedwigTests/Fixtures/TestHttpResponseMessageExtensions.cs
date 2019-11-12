using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using GraphQL.Common.Response;

namespace HedwigTests.Fixtures
{
    public static class TestHttpResponseMessageExtensions
    {
        public static async Task<GraphQLResponse> ParseGraphQLResponse(this HttpResponseMessage response)
        {
            var content = await response.Content.ReadAsStringAsync();
            if(TestEnvironmentFlags.ShouldLogHTTP()) {
                Console.WriteLine(content);
            }

            return JsonConvert.DeserializeObject<GraphQLResponse>(content);
        }
        public static async Task<T> GetObjectFromGraphQLResponse<T>(this HttpResponseMessage response, string fieldNameOverride = null)
        {
            var graphQLResponse = await response.ParseGraphQLResponse();
            if (graphQLResponse.Errors != null) {
                throw new Exception($"GraphQL Error: {graphQLResponse.Errors[0].Message}");
            }
            var fieldName = fieldNameOverride ?? GetDefaultFieldName<T>();
            return graphQLResponse.GetDataFieldAs<T>(fieldName);
        }

        private static string GetDefaultFieldName<T>()
        {
            var typeName = typeof(T).Name;
            return ToCamelCase(typeName);
        }

        private static String ToCamelCase(String str)
        {
            return Char.ToLowerInvariant(str[0]) + str.Substring(1);
        }
    }
}