using GraphQL;

namespace ecis2.Schema
{
	public class AppSchema : GraphQL.Types.Schema
	{
		public AppSchema(IDependencyResolver resolver)
			: base(resolver)
		{
			Query = resolver.Resolve<AppQuery>();
		}
	}
}
