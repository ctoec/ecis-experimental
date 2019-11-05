using System.Threading.Tasks;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Hedwig.Models;
using Hedwig.Schema;
using Xunit;

namespace HedwigTests.Integration.GraphQLMutations
{
    public class FundingMutationTests
    {
        [Fact]
        public async Task Create_Funding()
        {
            using (var api = new TestApiProvider()) {
                var enrollment = EnrollmentHelper.CreateEnrollment(api.Context);
                var source = FundingSource.CDC;
                var time = FundingTime.Full;
                

                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        createFunding(
                            enrollmentId: {enrollment.Id},
                            source: {source},
                            time: {time}
                        ) {{
                            enrollment {{ id }}
                            source
                            time
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                Funding funding = await response.GetObjectFromGraphQLResponse<Funding>("createFunding");
                Assert.Equal(enrollment.Id, funding.Enrollment.Id);
                Assert.Equal(source, funding.Source);
                Assert.Equal(time, funding.Time);
            }
        }

        [Fact]
        public async Task Create_Funding_Enrollment_Not_Found()
        {
            using (var api = new TestApiProvider()) {
                var invalidEnrollmentId = 0;
                var source = FundingSource.CDC;
                var time = FundingTime.Full;
                

                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        createFunding(
                            enrollmentId: {invalidEnrollmentId},
                            source: {source},
                            time: {time}
                        ) {{
                            id
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                var gqlResponse =  await response.ParseGraphQLResponse();
                Assert.NotEmpty(gqlResponse.Errors);
                Assert.Equal(AppErrorMessages.NOT_FOUND("Enrollment", invalidEnrollmentId), gqlResponse.Errors[0].Message);
            }
        }

        [Fact]
        public async Task Update_Funding()
        {
            using (var api = new TestApiProvider()) {
                var funding = FundingHelper.CreateFunding(api.Context);
                var time = FundingTime.Part;

                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        updateFunding(
                            id: {funding.Id},
                            time: {time}
                        ) {{
                            time
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                Funding update = await response.GetObjectFromGraphQLResponse<Funding>("updateFunding");
                Assert.Equal(time, update.Time);
            }
        }

        [Fact]
        public async Task Update_Funding_Not_Found()
        {
            using (var api = new TestApiProvider()) {
                var invalidId = 0;
                var source = FundingSource.CDC;
                

                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        updateFunding(
                            id: {invalidId},
                            source: {source},
                        ) {{
                            id
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                var gqlResponse =  await response.ParseGraphQLResponse();
                Assert.NotEmpty(gqlResponse.Errors);
                Assert.Equal(AppErrorMessages.NOT_FOUND("Funding", invalidId), gqlResponse.Errors[0].Message);
            }
        }
    }
}