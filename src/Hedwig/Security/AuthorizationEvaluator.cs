/*
 * Modified from https://github.com/graphql-dotnet/authorization/blob/8e7b3c70577c15ee45d16080eeba8273315b4e9c/src/GraphQL.Authorization/AuthorizationEvaluator.cs
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
 * - Change type of rules parameter in Evaluate to AuthorizationRules.
 * - Add Arguments parameter.
 * - Reimplement Evaluate using AuthorizationRuleResult.
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using GraphQL.Authorization;
using GraphQL.Language.AST;

namespace Hedwig.Security
{
	public interface IAuthorizationEvaluator
	{
		Task<AuthorizationResult> Evaluate(
				ClaimsPrincipal principal,
				object userContext,
				Dictionary<string, object> inputVariables,
				AuthorizationRules rules,
				Arguments arguments);
	}
	public class AuthorizationEvaluator : IAuthorizationEvaluator
	{
		private readonly AuthorizationSettings _settings;

		public AuthorizationEvaluator(AuthorizationSettings settings)
		{
				_settings = settings;
		}

		public async Task<AuthorizationResult> Evaluate(
			ClaimsPrincipal principal,
			object userContext,
			Dictionary<string, object> inputVariables,
			AuthorizationRules _rules,
			Arguments arguments)
		{
			var context = new Hedwig.Security.AuthorizationContext();
			context.User = principal ?? new ClaimsPrincipal(new ClaimsIdentity());
			context.UserContext = userContext;
			context.InputVariables = inputVariables;
			context.Arguments = arguments;
			var rules = _rules as IEnumerable<AuthorizationRule>;
			
			foreach (var rule in rules)
			{
				var policy = rule.Policy;
				var action = rule.Action;
				var authorizationPolicy = _settings.GetPolicy(policy);
				// Check if authorization rule was added without policy
				// Should be the final rule in the permissions block
				if (authorizationPolicy == null)
				{
					// Process final rule assuming no errors
					// Implies final rule must be "Allow" or "Deny"
					AuthorizationRuleResult result = action.Assess(false);
					if (result == AuthorizationRuleResult.Success)
					{
						return AuthorizationResult.Success();
					}
					else if (result == AuthorizationRuleResult.Failure)
					{
						return AuthorizationResult.Fail(context.Errors);
					}
					else
					{
						// Final rule must succeed or fail
						throw new Exception("Final rule must be Allow or Deny");
					}
				}
				else
				{
					var didError = false;
					foreach (var requirement in authorizationPolicy.Requirements)
					{
						// Because we are allowing "DenyNot" and "AllowNot" rules
						// but AuthorizationRequirement.Authorize only returns a
						// completed task and adds an error if and only if there
						// is an error, we need to check the number of errors to
						// determine if the most recent requirement succeeded.
						var startingCount = context.Errors.Count();
						await requirement.Authorize(context);
						var endingCount = context.Errors.Count();
						// Requirements are ANDed together, so we need to OR
						// the didError boolean
						didError = didError | (startingCount != endingCount);
					}
					AuthorizationRuleResult result = action.Assess(didError);
					if (result == AuthorizationRuleResult.Success)
					{
						return AuthorizationResult.Success();
					}
					else if (result == AuthorizationRuleResult.Failure)
					{
						return AuthorizationResult.Fail(context.Errors);
					}
					else // AuthorizationRuleResult.Continue
					{
						continue;
					}
				}
			}
			// there are no rules applied, so succeed
			return AuthorizationResult.Success();
		}
	}
}