using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Hedwig;
using Hedwig.Utilities;

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
			// Excluding ConfigureSqlServer and ConfigureHostedServices
			services.ConfigureCors();
			services.ConfigureFilters();
			services.ConfigureControllers();
			services.ConfigureSpa();
			services.ConfigureMapping();
			services.ConfigureRepositories();
			services.ConfigureAuthentication(Configuration.GetValue<string>("WingedKeysUri"));
			services.ConfigureAuthorization();
			services.ConfigureValidation();
			services.AddSingleton<IDateTime, SystemDateTime>();
			services.ConfigureSwagger();
			services.AddHttpContextAccessor();

			// Test Startup
			if (TestEnvironmentFlags.ShouldLogSQL())
			{
				services.AddLogging(configure => configure.AddConsole());
			}
			services.ConfigureAuthentication();
		}
	}
}
