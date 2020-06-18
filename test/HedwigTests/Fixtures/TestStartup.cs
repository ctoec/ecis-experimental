using Hedwig;
using Hedwig.Configuration;
using Hedwig.Utilities.DateTime;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace HedwigTests.Fixtures
{
	public class TestStartup : Startup
	{
		public TestStartup(IConfiguration configuration) : base(configuration) { }

		public override void ConfigureServices(IServiceCollection services)
		{
			// Test Startup
			services.ConfigureSqlServer(Configuration.GetConnectionString("HEDWIG"));
			// Main Startup
			// Excluding ConfigureSqlServer, ConfigureHostedServices, and ConfigureAuthentication
			services.ConfigureCors();
			services.ConfigureFilters();
			services.ConfigureControllers();
			services.ConfigureSpa();
			services.ConfigureMapping();
			services.ConfigureRepositories();
			services.ConfigureAuthorization();
			services.ConfigureValidation();
			services.AddSingleton<IDateTime, SystemDateTime>();
			services.ConfigureSwagger();
			services.AddHttpContextAccessor();
			// End main startup
			// Test Startup
			if (TestEnvironmentFlags.ShouldLogSQL())
			{
				services.AddLogging(configure => configure.AddConsole());
			}
			services.ConfigureAuthentication();
		}
	}
}
