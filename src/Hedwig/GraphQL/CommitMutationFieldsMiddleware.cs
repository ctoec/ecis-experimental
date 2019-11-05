using System;
using System.Threading.Tasks;
using GraphQL.Instrumentation;
using GraphQL.Types;
using Hedwig.Data;

namespace Hedwig.GraphQL
{
	public class CommitMutationFieldsMiddleware : IFieldsMiddleware
	{
		private readonly HedwigContext _context;
		public CommitMutationFieldsMiddleware(HedwigContext context)
		{
			_context = context;
		}

		public Task<object> Resolve(ResolveFieldContext context, FieldMiddlewareDelegate next)
		{
			if ("IntrospectionQuery".Equals(context.Operation.Name)) {
				return next(context);
			}
			
			_context.SaveChanges();
			return next(context);
		}
	}
}
