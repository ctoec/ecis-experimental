using Xunit;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Moq;
using Hedwig.Security;

namespace HedwigTests.Security
{
	public class AuthorizationRuleTests
	{
		[Theory]
		[InlineData(true, AuthorizationAction.Allow, AuthorizationRuleResult.Continue)]
		[InlineData(true, AuthorizationAction.Deny, AuthorizationRuleResult.Continue)]
		[InlineData(true, AuthorizationAction.AllowNot, AuthorizationRuleResult.Success)]
		[InlineData(true, AuthorizationAction.DenyNot, AuthorizationRuleResult.Failure)]
		[InlineData(false, AuthorizationAction.Allow, AuthorizationRuleResult.Success)]
		[InlineData(false, AuthorizationAction.Deny, AuthorizationRuleResult.Failure)]
		[InlineData(false, AuthorizationAction.AllowNot, AuthorizationRuleResult.Continue)]
		[InlineData(false, AuthorizationAction.DenyNot, AuthorizationRuleResult.Continue)]
		public void Assess_Returns_Corresponding_Result(bool didError, AuthorizationAction action, AuthorizationRuleResult expectedRuleResult)
		{
			// If
			var rule = new AuthorizationRule("", action);

			// Then
			var result = rule.Action.Assess(didError);

			// Ensure the number of rules equals number of results
			
			Assert.Equal(expectedRuleResult, result);
		}
	}
}