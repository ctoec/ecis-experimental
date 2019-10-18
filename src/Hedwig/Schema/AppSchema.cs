using GraphQL;
using Hedwig.Schema.Mutations;

namespace Hedwig.Schema
{
	public class AppSchema : GraphQL.Types.Schema
	{
		public AppSchema(IDependencyResolver resolver)
			: base(resolver)
		{
			Query = resolver.Resolve<AppQuery>();
			Mutation = resolver.Resolve<AppMutation>();
		}
	}
}
