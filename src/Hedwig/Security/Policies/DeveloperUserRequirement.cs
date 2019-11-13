using System.Threading.Tasks;
using System;

namespace Hedwig.Security
{
  public class DeveloperUserRequirement : IAuthorizationRequirement
  {
    public Task Authorize(AuthorizationContext context)
    {
      var user = context.User;
      if (user == null || !user.HasClaim("role", "developer"))
      {
        context.ReportError("A developer account is required");
      }
      return Task.CompletedTask;
    }
  }
}