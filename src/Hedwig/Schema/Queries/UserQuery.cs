using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;

namespace Hedwig.Schema.Queries
{
	public class UserQuery : ObjectGraphType<object>, IAppSubQuery
	{
		public UserQuery(IUserRepository repository)
		{
			Field<UserType>(
				"user",
				arguments: new QueryArguments(
					new QueryArgument<IdGraphType> { Name = "id" }
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
