using Microsoft.AspNetCore.Hosting;
using System.Threading.Tasks;
using System;

namespace Hedwig.Security
{
  public class TestModeRequirement : IAuthorizationRequirement
  {
    public Task Authorize(AuthorizationContext context)
    {
      var user = context.User;
      if (user == null || !user.HasClaim("test_mode", "true"))
      {
        context.ReportError("Test mode is required");
      }
      return Task.CompletedTask;
    }
  }
}