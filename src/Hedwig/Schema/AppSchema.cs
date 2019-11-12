using graphQL = GraphQL;
using Hedwig.Schema.Mutations;
using System;

namespace Hedwig.Schema
{
	public class AppSchema : graphQL::Types.Schema
	{
		public AppSchema(IServiceProvider resolver)
			: base(resolver)
		{
			Query = (AppQuery) resolver.GetService(typeof(AppQuery));
			Mutation = (AppMutation) resolver.GetService(typeof(AppMutation));
		}
	}
}
