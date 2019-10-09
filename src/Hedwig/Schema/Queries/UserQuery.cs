using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;

namespace Hedwig.Schema.Queries
{
	public class UserQuery : HedwigGraphType<object>, IAppSubQuery
	{
		public UserQuery(IUserRepository repository)
		{
			Field<UserType>(
				"user",
				arguments: new QueryArguments(
					new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }
					),
				resolve: context =>
				{
					var id = context.GetArgument<int>("id");
					return repository.GetUserByIdAsync(id);
				}
			);
		}
	}
}
