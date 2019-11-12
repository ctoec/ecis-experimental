using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Execution;
using GraphQL.Instrumentation;
using GraphQL.Language.AST;
using GraphQL.Types;
using GraphQL.Validation;
using GraphQL.Validation.Complexity;
using static GraphQL.Execution.ExecutionHelper;
using ExecutionContext = GraphQL.Execution.ExecutionContext;

namespace Hedwig.GraphQL
{
    public class EfDocumentExecuter : DocumentExecuter
    {
        public EfDocumentExecuter() : base()
        {
        }

        public EfDocumentExecuter(IDocumentBuilder documentBuilder, IDocumentValidator documentValidator, IComplexityAnalyzer complexityAnalyzer)
          : base(documentBuilder, documentValidator, complexityAnalyzer)
        {
        }

        protected override IExecutionStrategy SelectExecutionStrategy(ExecutionContext context)
        {
            switch (context.Operation.OperationType)
            {
                case OperationType.Query:
                    return new SerialExecutionStrategy();

                case OperationType.Mutation:
                    return new SerialExecutionStrategy();

                case OperationType.Subscription:
                    return new SubscriptionExecutionStrategy();

                default:
                    throw new InvalidOperationException($"Unexpected OperationType {context.Operation.OperationType}");
            }
        }
    }
}
