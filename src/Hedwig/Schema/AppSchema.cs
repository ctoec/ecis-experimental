using graphQL = GraphQL;
using Hedwig.Schema.Mutations;

namespace Hedwig.Schema
{
	public class AppSchema : graphQL::Types.Schema
	{
		public AppSchema(graphQL::IDependencyResolver resolver)
			: base(resolver)
		{
			Query = resolver.Resolve<AppQuery>();
			Mutation = resolver.Resolve<AppMutation>();
		}
	}
}
