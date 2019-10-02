using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;

namespace Hedwig.Schema.Queries
{
	public class EnrollmentQuery : ObjectGraphType<object>, IAppSubQuery
	{
		public EnrollmentQuery(IEnrollmentRepository repository)
		{
            Field<EnrollmentType>(
                "enrollment",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<int>("id");
                    return repository.GetEnrollmentByIdAsync(id);
                }
            );
		}
	}
}
