using GraphQL.Types;

namespace Hedwig.Schema
{
    public class HedwigGraphType<T> : ObjectGraphType<T>
    {
        public static RequestContext GetRequestContext(ResolveFieldContext<T> context)
        {
            return context.UserContext as RequestContext;
        }
    }
}