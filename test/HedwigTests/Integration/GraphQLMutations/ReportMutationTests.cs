using Xunit;
using System.Threading.Tasks;
using System;
using Hedwig.Models;
using Hedwig.Schema;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Integration.GraphQLMutations
{
    public class ReportMutationTests
    {
        [Fact]
        public async Task Update_Report()
        {
            using (var api = new TestApiProvider()) {
                // Given
                var report = ReportHelper.CreateCdcReport(api.Context);

                // When
                var submittedAt = DateTime.UtcNow.Date;
                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        submitCdcReport (id: {report.Id}, accredited: true) {{
                            ...on CdcReportType {{
                                id,
                                submittedAt
                            }}
                        }}
                    }}"
                );

                // Then
                response.EnsureSuccessStatusCode();
                CdcReport updated = await response.GetObjectFromGraphQLResponse<CdcReport>("submitCdcReport");
                Assert.Equal(report.Id, updated.Id);
                Assert.Equal(submittedAt, updated.SubmittedAt);
            }
        }

        [Fact]
        public async Task Update_Report_Id_Not_Found()
        {
            using (var api = new TestApiProvider()) {
                var invalidId = 0;
                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        submitCdcReport (id: {invalidId}, accredited: true) {{
                            ...on CdcReportType {{
                                id
                            }}
                        }}
                    }}"
                );
                var gqlResponse = await response.ParseGraphQLResponse();
                Assert.NotEmpty(gqlResponse.Errors);
                Assert.Equal(AppErrorMessages.NOT_FOUND("Report", invalidId), gqlResponse.Errors[0].Message);
            }
        }
    }
}