using Microsoft.AspNetCore.Authentication;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;

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
      var authenticationTicket = new AuthenticationTicket(
        new ClaimsPrincipal(Options.Identity),
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
    public virtual ClaimsIdentity Identity { get; } = new ClaimsIdentity(
      new Claim[] {
        new Claim("test_mode", "true")
      },
      "test"
    );
  }
}