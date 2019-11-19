using System;
using System.Collections.Generic;
using System.Threading;
using Microsoft.Extensions.Options;
using Hedwig.Data;
using Hedwig.Schema;
using GraphQL;
using GraphQL.Types;
using GraphQL.Server;
using GraphQL.Server.Internal;
using GraphQL.Instrumentation;
using GraphQL.Validation;
using GraphQL.Execution;


namespace Hedwig.GraphQL
{
	public class HedwigExecutor<TSchema> : DefaultGraphQLExecuter<TSchema>
		where TSchema : ISchema
	{
		private readonly IEnumerable<IFieldsMiddleware> _middlewares;

		public HedwigExecutor(
			IEnumerable<IFieldsMiddleware> middlewares,
			TSchema schema,
			IDocumentExecuter documentExecuter,
			IOptions<GraphQLOptions> options,
			IEnumerable<IDocumentExecutionListener> listeners,
			IEnumerable<IValidationRule> validationRules)
			: base(schema, documentExecuter, options, listeners, validationRules)
		{
			_middlewares = middlewares;
		}

		protected override ExecutionOptions GetOptions(string operationName, string query, Inputs variables, IDictionary<string, object> context, CancellationToken cancellationToken)
		{
			var opts = base.GetOptions(operationName, query, variables, context, cancellationToken);
			foreach (var middleware in _middlewares)
			{
				opts.FieldMiddleware.Use(next =>
				{
					return _context =>
					{
						return middleware.Resolve(_context, next);
					};
				});
			}
			
			return opts;
		}
	}
}