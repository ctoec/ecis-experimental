using Microsoft.AspNetCore.Authentication;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using HedwigTests.Helpers;

namespace HedwigTests.Fixtures
{
  public class TestAuthenticationHandler : AuthenticationHandler<TestAuthenticationOptions>
  {
    public TestAuthenticationHandler(
      IOptionsMonitor<TestAuthenticationOptions> options,
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
        "Test Scheme"
      );
      return Task.FromResult(AuthenticateResult.Success(authenticationTicket));
    }
  }

  public static class TestAuthenticationExtensions {
    public static AuthenticationBuilder AddTestAuth(this AuthenticationBuilder builder, Action<TestAuthenticationOptions> configureOptions)
    {
      return builder.AddScheme<TestAuthenticationOptions, TestAuthenticationHandler>("Test Scheme", "Test Auth", configureOptions);
    }
  }

  public class TestAuthenticationOptions : AuthenticationSchemeOptions
  {
  }
}