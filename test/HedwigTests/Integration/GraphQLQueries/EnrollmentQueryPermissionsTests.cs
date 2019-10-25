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
	public class EnrollmentQueryPermissionsTests
	{
		[Fact]
		public async Task When_No_Auth_Get_Enrollment_By_Id_Fails()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context);
				api.Client.DefaultRequestHeaders.Add("no_auth", "true");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						enrollment (id: ""{enrollment.Id}"" ) {{
							id
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
		public async Task When_Not_Developer_Get_Enrollment_By_Id_Fails()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context);
				api.Client.DefaultRequestHeaders.Add("role", "not a developer");
				api.Client.DefaultRequestHeaders.Add("claims_sub", "123");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						enrollment (id: ""{enrollment.Id}"" ) {{
							id
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
		public async Task When_Developer_Get_Enrollment_By_Id_Succeeds()
		{
			using (var api = new TestApiProvider())
			{
				// If
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context);
				api.Client.DefaultRequestHeaders.Add("role", "developer");
				api.Client.DefaultRequestHeaders.Add("claims_sub", "123");

				// When
				var response = await api.Client.GetGraphQLAsync(
					$@"{{
						enrollment (id: ""{enrollment.Id}"" ) {{
							id
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Enrollment enrollmentRes = await response.GetObjectFromGraphQLResponse<Enrollment>();
				Assert.Equal(enrollment.Id, enrollmentRes.Id);
			}
		}
	}
}
