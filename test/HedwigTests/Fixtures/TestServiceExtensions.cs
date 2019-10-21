using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using GraphQL.Authorization;
using GraphQL.Validation;
using Hedwig.Security;

namespace HedwigTests.Fixtures
{
	public static class TestServiceExtensions
	{
		public static void ConfigureSqlServer(this IServiceCollection services, string connectionString)
		{
			services.AddDbContext<TestHedwigContext>(options =>
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
				}).AddTestAuth(o => {});
		}
	}
}