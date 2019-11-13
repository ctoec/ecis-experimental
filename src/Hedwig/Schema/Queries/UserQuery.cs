using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace Hedwig.Schema.Queries
{
	public class UserQuery : HedwigGraphType<object>, IAppSubQuery
	{
		public UserQuery(IUserRepository repository)
		{
			FieldAsync<UserType>(
				"user",
				arguments: new QueryArguments(
					new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }
					),
				resolve: async context =>
				{
					var id = context.GetArgument<int>("id");
					return await repository.GetUserByIdAsync(id);
				}
			);
			FieldAsync<UserType>(
				"me",
				arguments: new QueryArguments(),
				resolve: async context =>
				{
					var user = GetRequestContext(context).User;
					var subClaim = user.FindFirst("sub");
					var id = Int32.Parse(subClaim?.Value ?? "");
					return await repository.GetUserByIdAsync(id);
				}
			);
		}
	}
}
