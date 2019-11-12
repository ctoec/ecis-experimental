using System;
using System.Threading.Tasks;
using GraphQL.Types;
using GraphQL.Instrumentation;

namespace Hedwig.GraphQL
{
	public interface IFieldsMiddleware
	{
		Task<object> Resolve(ResolveFieldContext context, FieldMiddlewareDelegate next);
	}
}
