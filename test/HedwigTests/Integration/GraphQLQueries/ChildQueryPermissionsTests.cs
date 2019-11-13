using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Xunit;
using Hedwig.Data;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using GraphQL.Common.Response;

namespace HedwigTests.Integration.GraphQLQueries
{
	public class ChildQueryPermissionsTests
	{
		[Fact]
		public async Task When_No_Auth_Get_Child_By_Id_Fails()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var child = ChildHelper.CreateChild(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("no_auth", "true");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						child (id: ""{child.Id}"" ) {{
							firstName
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				GraphQLResponse res = await response.ParseGraphQLResponse();
				Assert.NotNull(res.Errors);
			}
		}

		[Fact]
		public async Task When_Not_Developer_Get_Child_By_Id_Fails()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var child = ChildHelper.CreateChild(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("role", "not a developer");
				api.Client.DefaultRequestHeaders.Add("claims_sub", "123");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						child (id: ""{child.Id}"" ) {{
							firstName
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				GraphQLResponse res = await response.ParseGraphQLResponse();
				Assert.NotNull(res.Errors);
			}
		}

		[Fact]
		public async Task When_Developer_Get_Child_By_Id_Succeeds()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var child = ChildHelper.CreateChild(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("role", "developer");
				api.Client.DefaultRequestHeaders.Add("claims_sub", "123");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						child (id: ""{child.Id}"" ) {{
							firstName
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Child childRes = await response.GetObjectFromGraphQLResponse<Child>();
				Assert.Equal(firstName, childRes.FirstName);
			}
		}
	}
}
