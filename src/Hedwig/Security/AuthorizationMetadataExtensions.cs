/*
 * Modified from https://github.com/graphql-dotnet/authorization/blob/8e7b3c70577c15ee45d16080eeba8273315b4e9c/src/GraphQL.Authorization/AuthorizationMetadataExtensions.cs
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
  * - Different approach for retrieving permission rules.
  */

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using GraphQL.Builders;
using GraphQL.Types;
using GraphQL.Authorization;

namespace Hedwig.Security
{
    public static class AuthorizationMetadataExtensions
    {
        public static bool RequiresAuthorization(this IProvideMetadata type)
        {
            return type is IAuthorizedGraphType;
        }
        
        public static Task<AuthorizationResult> Authorize(
            this IProvideMetadata type,
            ClaimsPrincipal principal,
            object userContext,
            Dictionary<string, object> inputVariables,
            IAuthorizationEvaluator evaluator)
        {
            var authorizedType = type as IAuthorizedGraphType;
            var rules = new AuthorizationRules();
            rules = authorizedType.Permissions(rules);
            return evaluator.Evaluate(principal, userContext, inputVariables, rules);
        }
    }
}
