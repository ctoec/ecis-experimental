using Xunit;
using System.Threading.Tasks;
using System;
using Hedwig.Models;
using Hedwig.Schema;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Integration.GraphQLMutations
{
	public class EnrollmentMutationTests
	{
		[Fact]
		public async Task Update_Enrollment_With_Entry_And_Exit()
		{
			using (var api = new TestApiProvider()) {
				// If
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context, entry: "2000-1-1", exit: "2000-2-2");
				var entry = new DateTime(2019, 10, 10, 0, 0, 0);
				var exit = new DateTime(2020, 10, 10, 0, 0, 0);

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateEnrollment (id: {enrollment.Id}, entry: ""{entry.ToString()}"", exit: ""{exit.ToString()}"") {{
							id
							entry
							exit
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Enrollment updated = await response.GetObjectFromGraphQLResponse<Enrollment>("updateEnrollment");
				Assert.Equal(enrollment.Id, updated.Id);
				Assert.Equal(entry, updated.Entry);
				Assert.Equal(exit, updated.Exit);
			}
		}

		[Fact]
		public async Task Update_Enrollment_With_Entry()
		{
			using (var api = new TestApiProvider()) {
				// If
				var exit = new DateTime(2020, 2, 2, 0, 0, 0);
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context, entry: "2000-1-1", exit: exit.ToString());
				var entry = new DateTime(2019, 10, 10, 0, 0, 0);
				

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateEnrollment (id: {enrollment.Id}, entry: ""{entry.ToString()}"") {{
							id
							entry
							exit
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Enrollment updated = await response.GetObjectFromGraphQLResponse<Enrollment>("updateEnrollment");
				Assert.Equal(enrollment.Id, updated.Id);
				Assert.Equal(entry, updated.Entry);
				Assert.Equal(exit, updated.Exit);
			}
		}

		[Fact]
		public async Task Update_Enrollment_With_Exit()
		{
			using (var api = new TestApiProvider()) {
				// If
				var entry = new DateTime(2020, 2, 2, 0, 0, 0);
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context, entry: entry.ToString(), exit: "2020-06-06");
				var exit = new DateTime(2020, 8, 8, 0, 0, 0);
				

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateEnrollment (id: {enrollment.Id}, exit: ""{exit.ToString()}"") {{
							id
							entry
							exit
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Enrollment updated = await response.GetObjectFromGraphQLResponse<Enrollment>("updateEnrollment");
				Assert.Equal(enrollment.Id, updated.Id);
				Assert.Equal(entry, updated.Entry);
				Assert.Equal(exit, updated.Exit);
			}
		}

		[Fact]
		public async Task Update_Enrollment_Clear_Exit()
		{
			using (var api = new TestApiProvider()) {
				// If
				var entry = new DateTime(2020, 2, 2, 0, 0, 0);
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context, entry: entry.ToString(), exit: "2020-06-06");
				

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateEnrollment (id: {enrollment.Id}, exit: ""null"") {{
							id
							entry
							exit
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Enrollment updated = await response.GetObjectFromGraphQLResponse<Enrollment>("updateEnrollment");
				Assert.Equal(enrollment.Id, updated.Id);
				Assert.Equal(entry, updated.Entry);
				Assert.Null(updated.Exit);
			}
		}

		[Fact]
		public async Task Update_Enrollment_With_Entry_Clear_Exit()
		{
			using (var api = new TestApiProvider()) {
				// If
				
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context, entry: "2019-01-01", exit: "2020-06-06");
				var entry = new DateTime(2020, 1, 1, 0, 0, 0);

				// When
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateEnrollment (id: {enrollment.Id}, entry: ""{entry.ToString()}"" exit: ""null"") {{
							id
							entry
							exit
						}}
					}}"
				);

				// Then
				response.EnsureSuccessStatusCode();
				Enrollment updated = await response.GetObjectFromGraphQLResponse<Enrollment>("updateEnrollment");
				Assert.Equal(enrollment.Id, updated.Id);
				Assert.Equal(entry, updated.Entry);
				Assert.Null(updated.Exit);
			}
		}

		[Fact]
		public async Task Update_Enrollment_Id_Not_Found()
		{
			using (var api = new TestApiProvider()) {
				var invalidId = 0;
				var response = await api.Client.PostGraphQLAsync(
					$@"mutation {{
						updateEnrollment (id: {invalidId}, entry: ""2010-10-10"") {{
							id
							entry
							exit
						}}
					}}"
				);
				var gqlResponse = await response.ParseGraphQLResponse();
				Assert.NotEmpty(gqlResponse.Errors);
				Assert.Equal(AppErrorMessages.NOT_FOUND("Enrollment", invalidId), gqlResponse.Errors[0].Message);
			}
		}
	}
}