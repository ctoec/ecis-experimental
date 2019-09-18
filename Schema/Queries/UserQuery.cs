using Hedwig.Repositories;
using GraphQL.Types;

namespace Hedwig.Schema
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
