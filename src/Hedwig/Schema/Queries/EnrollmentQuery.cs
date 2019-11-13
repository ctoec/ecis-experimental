using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;
using System;

namespace Hedwig.Schema.Queries
{
	public class EnrollmentQuery : TemporalGraphType<object>, IAppSubQuery
	{
		public EnrollmentQuery(IEnrollmentRepository repository)
		{
            FieldAsync<EnrollmentType>(
                "enrollment",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" },
                    new QueryArgument<DateGraphType> { Name = "asOf" }
                ),
                resolve: async context => 
                {
                    var id = context.GetArgument<int>("id");
                    DateTime? asOf = context.GetArgument<DateTime?>("asOf");
                    SetAsOfGlobal(context, asOf);
                    return await repository.GetEnrollmentByIdAsync(id, asOf);
                }
            );
		}
	}
}
