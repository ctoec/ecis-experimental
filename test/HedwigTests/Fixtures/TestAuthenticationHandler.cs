using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using HedwigTests.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HedwigTests.Fixtures
{
	public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
	{
		public TestAuthenticationHandler(
			IOptionsMonitor<AuthenticationSchemeOptions> options,
			ILoggerFactory logger,
			UrlEncoder encoder,
			ISystemClock clock) : base(options, logger, encoder, clock)
		{
		}

		protected override Task<AuthenticateResult> HandleAuthenticateAsync()
		{
			var noAuth = Request.Headers["no_auth"];
			if (!(string.IsNullOrEmpty(noAuth)))
			{
				return Task.FromResult(AuthenticateResult.Fail("no auth"));
			}

			var sub = Request.Headers["claims_sub"];
			var role = Request.Headers["role"];
			ClaimsIdentity identity;
			if (string.IsNullOrEmpty(sub) && string.IsNullOrEmpty(role))
			{
				identity = AuthorizationRequirementHelper.GetTestIdentity();
			}
			else if (string.IsNullOrEmpty(sub))
			{
				var claims = new Dictionary<string, string> {
			{ "role", role }
		};
				identity = AuthorizationRequirementHelper.CreateIdentity("test", claims);
			}
			else if (string.IsNullOrEmpty(role))
			{
				var claims = new Dictionary<string, string> {
			{ "sub", sub },
		};
				identity = AuthorizationRequirementHelper.CreateIdentity("test", claims);
			}
			else
			{
				var claims = new Dictionary<string, string> {
			{ "sub", sub },
			{ "role", role }
		};
				identity = AuthorizationRequirementHelper.CreateIdentity("test", claims);
			}

			var authenticationTicket = new AuthenticationTicket(
			new ClaimsPrincipal(identity),
			new AuthenticationProperties(),
			"Test"
			);
			return Task.FromResult(AuthenticateResult.Success(authenticationTicket));
		}
	}

	public static class TestAuthenticationExtensions
	{
		public static AuthenticationBuilder AddTestAuth(this AuthenticationBuilder builder, Action<AuthenticationSchemeOptions> configureOptions)
		{
			return builder.AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>("Test Scheme", "Test Auth", configureOptions);
		}
	}
}
