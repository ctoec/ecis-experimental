using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Hedwig;

namespace HedwigTests.Fixtures
{
  public class TestStartup : Startup
  {
	public TestStartup(IConfiguration configuration) : base(configuration) { }

	public override void ConfigureServices(IServiceCollection services)
	{
	  base.ConfigureServices(services);
	  services.ConfigureSqlServer(Configuration.GetConnectionString("HEDWIG"));

	  IHttpContextAccessor httpContextAccessor = new TestHttpContextAccessorProvider().HttpContextAccessor;
	  services.AddSingleton<IHttpContextAccessor>(httpContextAccessor);
	  if (TestEnvironmentFlags.ShouldLogSQL())
	  {
		services.AddLogging(configure => configure.AddConsole());
	  }
	  services.ConfigureAuthentication();
	}
  }
}
