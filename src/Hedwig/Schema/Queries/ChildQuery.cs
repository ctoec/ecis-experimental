using System;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using GraphQL.Types;

namespace Hedwig.Schema.Queries
{
	public class ChildQuery : TemporalGraphType<object>, IAppSubQuery
	{
		public ChildQuery(IChildRepository repository)
		{
			FieldAsync<ChildType>(
				"child",
				arguments: new QueryArguments(
					new QueryArgument<NonNullGraphType<IdGraphType>>{ Name = "id" },
					new QueryArgument<DateGraphType>{ Name = "asOf" }
				),
				resolve: async context => 
				{
					var id = context.GetArgument<Guid>("id");
					var asOf = context.GetArgument<DateTime?>("asOf");
					SetAsOfGlobal(context, asOf);
					return await repository.GetChildByIdAsync_OLD(id, asOf);
				}
			);
		}
	}
}
