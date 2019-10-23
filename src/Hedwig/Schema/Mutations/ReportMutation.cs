using GraphQL.Types;
using GraphQL;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using Hedwig.Models;
using System.Collections.Generic;
using System;

namespace Hedwig.Schema.Mutations
{
    public class ReportMutation : ObjectGraphType<Report>, IAppSubMutation
    {
        public ReportMutation(IReportRepository repository)
        {
            FieldAsync<ReportType>(
                "submitCdcReport",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>>{ Name = "id" },
                    new QueryArgument<NonNullGraphType<BooleanGraphType>>{ Name = "accredited" }
                ),
                resolve: async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var report = (CdcReport) await repository.GetReportByIdAsync(id);
                    if (report == null) {
                        throw new ExecutionError(
                            AppErrorMessages.NOT_FOUND("Report", id)
                        );
                    }

                    report.SubmittedAt = DateTime.Now.ToUniversalTime();
                    report.Accredited =context.GetArgument<bool>("accredited");
                    return repository.UpdateReport(report);
                }
            );
        }
    }
}
