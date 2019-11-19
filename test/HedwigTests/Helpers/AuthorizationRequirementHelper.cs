using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using System.Security.Claims;

// GraphQL Support
using Hedwig.Security;
// End GraphQL Support

namespace HedwigTests.Helpers
{
	public class AuthorizationRequirementHelper
	{
		// GraphQL Support
		public const string RequirementException = "Requirement exception";
		private class AlwaysTrueRequirement : IAuthorizationRequirement
		{
			public Task Authorize(AuthorizationContext _)
			{
				return Task.CompletedTask;
			}
		}

		private class AlwaysFalseRequirement : IAuthorizationRequirement
		{
			public Task Authorize(AuthorizationContext _)
			{
				_.ReportError("This always fails");
				return Task.CompletedTask;
			}
		}

		private class ThrowsExceptionRequirement : IAuthorizationRequirement
		{
			public Task Authorize(AuthorizationContext _)
			{
				throw new Exception(RequirementException);
			}
		}

		public static IAuthorizationRequirement GetAlwaysTrueRequirement()
		{
			return new AlwaysTrueRequirement();
		}

		public static IAuthorizationRequirement GetAlwaysFalseRequirement()
		{
			return new AlwaysFalseRequirement();
		}

		public static IAuthorizationRequirement GetThrowsExceptionRequirement()
		{
			return new ThrowsExceptionRequirement();
		}
		// End GraphQL Support
		public static ClaimsPrincipal CreatePrincipal(string authenticationType = null, IDictionary<string, string> claims = null)
		{
			var identity = CreateIdentity(authenticationType, claims);
			return new ClaimsPrincipal(identity);
		}

		public static ClaimsIdentity CreateIdentity(string authenticationType, IDictionary<string, string> claims = null)
		{
			var claimsList = new List<Claim>();

			if (claims != null)
			{
				foreach (var c in claims)
				{
					claimsList.Add(new Claim(c.Key, c.Value));
				}
			}

			return new ClaimsIdentity(claimsList, authenticationType);
		}

		public static ClaimsIdentity GetTestIdentity()
		{
			return new ClaimsIdentity(
				new Claim[] {
					new Claim("test_mode", "true")
				},
				"test"
			);
		}
	}
}
