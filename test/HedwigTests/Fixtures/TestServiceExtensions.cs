using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace HedwigTests.Fixtures
{
    public static class TestServiceExtensions
    {
        public static void ConfigureSqlServer(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<TestHedwigContext>(options =>
                options.UseSqlServer(connectionString)
            );
        }
    }
}