using Xunit;
using System.Threading.Tasks;
using System;
using Hedwig.Models;
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
                        updatedCdcReport (reportInput: {{
                            id: {report.Id},
                            reportingPeriodId: {report.ReportingPeriodId},
                            organizationId: {report.OrganizationId},
                            submittedAt: ""{submittedAt}"",
                            accredited: true
                        }}) {{
                            ...on CdcReportType {{
                                id,
                                submittedAt
                            }}
                        }}
                    }}"
                );

                // Then
                response.EnsureSuccessStatusCode();
                CdcReport updated = await response.ParseGraphQLResponse<CdcReport>("updatedCdcReport");
                Assert.Equal(report.Id, updated.Id);
                Assert.Equal(submittedAt, updated.SubmittedAt);
            }
        }
    }
}