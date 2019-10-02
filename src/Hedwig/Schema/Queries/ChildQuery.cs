using System;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;

namespace Hedwig.Schema.Queries
{
	public class ChildQuery : ObjectGraphType<object>, IAppSubQuery
	{
		public ChildQuery(IChildRepository repository)
		{
			Field<ChildType>(
				"child",
				arguments: new QueryArguments(
					new QueryArgument<NonNullGraphType<IdGraphType>>{ Name = "id" },
					new QueryArgument<DateGraphType>{ Name = "asOf" }
				),
				resolve: context => 
				{
					var id = context.GetArgument<Guid>("id");
					var asOf = context.GetArgument<DateTime?>("asOf");
					if(asOf.HasValue) {
						return repository.GetChildByIdAsOfAsync(id, asOf.Value);
					}
					return repository.GetChildByIdAsync(id);
				}
			);
		}
	}
}
