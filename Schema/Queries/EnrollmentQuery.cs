using Hedwig.Repositories;
using GraphQL.Types;

namespace Hedwig.Schema
{
	public class EnrollmentQuery : ObjectGraphType<object>, IAppSubQuery
	{
		public EnrollmentQuery(IEnrollmentRepository repository)
		{
            Field<EnrollmentType>(
                "enrollment",
                arguments: new QueryArguments(
                    new QueryArgument<IdGraphType> { Name = "id" }
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
