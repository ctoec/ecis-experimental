using Hedwig.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HedwigTests.Fixtures
{
	public static class TestServiceExtensions
	{
		public static void ConfigureSqlServer(this IServiceCollection services, string connectionString)
		{
			services.AddDbContext<HedwigContext>(options =>
					options.UseSqlServer(connectionString)
						.EnableSensitiveDataLogging()
			);
		}

		public static void ConfigureAuthentication(this IServiceCollection services)
		{
			services.AddAuthentication(options =>
				{
					options.DefaultAuthenticateScheme = "Test Scheme";
					options.DefaultChallengeScheme = "Test Scheme";
				}).AddTestAuth(o => { });
		}
	}
}
