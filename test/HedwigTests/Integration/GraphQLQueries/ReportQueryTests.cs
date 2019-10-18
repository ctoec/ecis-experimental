using Xunit;
using System.Threading.Tasks;
using Hedwig.Models;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Integration.GraphQLQueries
{
    public class ReportQueryTests
    {
        [Fact]
        public async Task Get_Report_By_Id()
        {
            using (var api = new TestApiProvider())
            {
                // Given
                var report = ReportHelper.CreateCdcReport(api.Context);

                // When
                var response = await api.Client.GetGraphQLAsync(
                    $@"{{
                        report (id : {report.Id}) {{
                            ...on CdcReportType {{
                                id
                            }}
                        }}
                    }}"
                );

                // Then
                response.EnsureSuccessStatusCode();
                CdcReport reportRes = await response.ParseGraphQLResponse<CdcReport>("report");
                Assert.Equal(report.Id, reportRes.Id);
            }
        }
    }
}