/*
 * Modified from https://github.com/graphql-dotnet/authorization/blob/8e7b3c70577c15ee45d16080eeba8273315b4e9c/src/GraphQL.Authorization/AuthorizationValidationRule.cs
 */
/**
 * The MIT License (MIT)
 * Copyright (c) 2017 Joseph T. McBride
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 /*
  * Summary of Changes
  * - Add arguments parameter to CheckAuth.
  */

using System.Linq;
using GraphQL;
using GraphQL.Language.AST;
using GraphQL.Types;
using GraphQL.Validation;
using GraphQL.Authorization;

using System;

namespace Hedwig.Security
{
    public class AuthorizationValidationRule : IValidationRule
    {
        private readonly IAuthorizationEvaluator _evaluator;

        public AuthorizationValidationRule(IAuthorizationEvaluator evaluator)
        {
            _evaluator = evaluator;
        }

        public INodeVisitor Validate(ValidationContext context)
        {
            var userContext = context.UserContext as IProvideClaimsPrincipal;

            return new EnterLeaveListener(_ =>
            {
                var operationType = OperationType.Query;

                // this could leak info about hidden fields or types in error messages
                // it would be better to implement a filter on the Schema so it
                // acts as if they just don't exist vs. an auth denied error
                // - filtering the Schema is not currently supported

                _.Match<Operation>(astType =>
                {
                    operationType = astType.OperationType;

                    var type = context.TypeInfo.GetLastType();
                    CheckAuth(astType, type, userContext, context, operationType);
                });

                _.Match<ObjectField>(objectFieldAst =>
                {
                    var argumentType = context.TypeInfo.GetArgument().ResolvedType.GetNamedType() as IComplexGraphType;
                    if (argumentType == null)
                        return;

                    var fieldType = argumentType.GetField(objectFieldAst.Name);
                    CheckAuth(objectFieldAst, fieldType, userContext, context, operationType);
                });

                _.Match<Field>(fieldAst =>
                {
                    var fieldDef = context.TypeInfo.GetFieldDef();

                    if (fieldDef == null) return;

                    // check target field
                    CheckAuth(fieldAst, fieldDef, userContext, context, operationType, fieldAst.Arguments);
                    // check returned graph type
                    CheckAuth(fieldAst, fieldDef.ResolvedType.GetNamedType(), userContext, context, operationType, fieldAst.Arguments);
                });
            });
        }

        private void CheckAuth(
            INode node,
            IProvideMetadata type,
            IProvideClaimsPrincipal userContext,
            ValidationContext context,
            OperationType operationType,
            Arguments arguments = null)
        {
            if (type == null || !type.RequiresAuthorization()) return;
            if (arguments == null)
            {
                arguments = new Arguments();
            }

            var result = type
                .Authorize(userContext?.User, context.UserContext, context.Inputs, _evaluator, arguments)
                .GetAwaiter()
                .GetResult();

            if (result.Succeeded) return;

            var error = string.Join("\n", result.Errors);

            context.ReportError(new ValidationError(
                context.OriginalQuery,
                "authorization",
                $"You are not authorized to run this {operationType.ToString().ToLower()}.\n{error}",
                node));
        }
    }
}
