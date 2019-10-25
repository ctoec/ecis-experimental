using Xunit;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Moq;
using Hedwig.Security;
using System;

namespace HedwigTests.Security
{
	public class AuthorizationRulesTests
	{
		[Fact]
		public void Allow_Adds_AuthorizationRule_With_Allow_Result()
		{
			// If
			var rules = new AuthorizationRules();
			var policy = "policy";

			// When
			rules.Allow(policy);

			// Then
			var rulesList = rules.GetEnumerator();
			rulesList.MoveNext();
			var rule = rulesList.Current;

			// Ensure the action is Allow
			Assert.Equal(AuthorizationAction.Allow, rule.Action);
		}

		[Fact]
		public void AllowNot_Adds_AuthorizationRule_With_AllowNot_Result()
		{
			// If
			var rules = new AuthorizationRules();
			var policy = "policy";

			// When
			rules.AllowNot(policy);

			// Then
			var rulesList = rules.GetEnumerator();
			rulesList.MoveNext();
			var rule = rulesList.Current;

			// Ensure the action is AllowNot
			Assert.Equal(AuthorizationAction.AllowNot, rule.Action);
		}

		[Fact]
			public void Deny_Adds_AuthorizationRule_With_Deny_Result()
			{
				// If
				var rules = new AuthorizationRules();
				var policy = "policy";

				// When
				rules.Deny(policy);

				// Then
				var rulesList = rules.GetEnumerator();
				rulesList.MoveNext();
				var rule = rulesList.Current;

				// Ensure the action is Deny
				Assert.Equal(AuthorizationAction.Deny, rule.Action);
			}

			[Fact]
			public void DenyNot_Adds_AuthorizationRule_With_DenyNot_Result()
			{
				// If
				var rules = new AuthorizationRules();
				var policy = "policy";

				// When
				rules.DenyNot(policy);

				// Then
				var rulesList = rules.GetEnumerator();
				rulesList.MoveNext();
				var rule = rulesList.Current;

				// Ensure the action is DenyNot
				Assert.Equal(AuthorizationAction.DenyNot, rule.Action);
			}
	}
}