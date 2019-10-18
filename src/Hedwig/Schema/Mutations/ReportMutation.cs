using GraphQL.Types;
using GraphQL;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using Hedwig.Models;

namespace Hedwig.Schema.Mutations
{
    public class CdcReportInputType : InputObjectGraphType
    {
        public CdcReportInputType()
        {
            Name = "CdcReportInput";
            Field<NonNullGraphType<IntGraphType>>("id");
            Field<NonNullGraphType<IntGraphType>>("reportingPeriodId");
            Field<NonNullGraphType<IntGraphType>>("organizationId");
            Field<DateTimeGraphType>("submittedAt");
            Field<NonNullGraphType<BooleanGraphType>>("accredited");
        }
    }
    public class ReportMutation : ObjectGraphType<Report>, IAppSubMutation
    {
        public ReportMutation(IReportRepository repository)
        {
            Field<ReportType>(
                "updatedCdcReport",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<CdcReportInputType>> { Name = "reportInput" }
                ),
                resolve: context =>
                {
                    var reportInput = context.GetArgument<CdcReport>("reportInput");
                    reportInput.SubmittedAt = System.DateTime.Now.ToUniversalTime();
                    return repository.UpdateReport(reportInput);
                }
            );
        }
    }
}