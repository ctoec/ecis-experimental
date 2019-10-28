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
	public class UserQueryPermissionsTests
	{
		[Fact]
		public async Task When_No_Auth_Get_User_By_Id_Fails()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var user = UserHelper.CreateUser(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("no_auth", "true");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						user (id: {user.Id} ) {{
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
		public async Task When_No_Auth_Me_Fails()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var user = UserHelper.CreateUser(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("no_auth", "true");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						me {{
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
		public async Task When_Not_Current_User_Get_User_By_Id_Fails()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var user = UserHelper.CreateUser(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("claims_sub", $"{user.Id + 100000}");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						user (id: {user.Id} ) {{
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
		public async Task When_Current_User_Get_User_By_Id_Succeeds()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var user = UserHelper.CreateUser(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("claims_sub", $"{user.Id}");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						user (id: {user.Id} ) {{
							firstName
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				User userRes = await response.GetObjectFromGraphQLResponse<User>();
				Assert.Equal(firstName, userRes.FirstName);
			}
		}

		[Fact]
		public async Task When_Current_User_Me_Succeeds()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var firstName = "FIRSTNAME";
				var user = UserHelper.CreateUser(api.Context, firstName: firstName);
				api.Client.DefaultRequestHeaders.Add("claims_sub", $"{user.Id}");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						me {{
							firstName
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				User userRes = await response.GetObjectFromGraphQLResponse<User>("me");
				Assert.Equal(firstName, userRes.FirstName);
			}
		}
	}
}
