using Microsoft.AspNetCore.Hosting;
using System.Threading.Tasks;
using Hedwig.Schema;

namespace Hedwig.Security
{
  public class DevelopmentRequirement : IAuthorizationRequirement
  {
    private readonly IHostingEnvironment _env;
    public DevelopmentRequirement(IHostingEnvironment env)
    {
      _env = env;
    }
    public Task Authorize(AuthorizationContext context)
    {
      if (!(_env.IsDevelopment()))
      {
        context.ReportError("Development environment is required");
      }
      return Task.CompletedTask;
    }
  }
}