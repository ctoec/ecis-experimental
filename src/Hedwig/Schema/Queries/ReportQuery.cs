using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;

namespace Hedwig.Schema.Queries
{
    public class ReportQuery : ObjectGraphType<object>, IAppSubQuery
    {
        public ReportQuery(IReportRepository repository)
        {
            Field<ReportType>(
                "report",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }
                ),
                resolve: context => 
                {
                    var id = context.GetArgument<int>("id");
                    return repository.GetReportByIdAsync(id);
                }
            );
        }
    }
}