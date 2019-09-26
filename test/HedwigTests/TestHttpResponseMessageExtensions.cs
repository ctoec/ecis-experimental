using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using GraphQL.Common.Response;

namespace HedwigTests
{
    public static class TestHttpResponseMessageExtensions
    {
        public static async Task<T> ParseGraphQLResponse<T>(this HttpResponseMessage response, string fieldName)
        {
            var content = await response.Content.ReadAsStringAsync();
            GraphQLResponse graphQLResponse = JsonConvert.DeserializeObject<GraphQLResponse>(content);
            if (graphQLResponse.Errors != null) {
                throw new Exception($"GraphQL Error: {graphQLResponse.Errors[0].Message}");
            }
            return graphQLResponse.GetDataFieldAs<T>(fieldName);
        }
    }
}