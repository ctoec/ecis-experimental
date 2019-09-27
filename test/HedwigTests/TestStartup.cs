using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Hedwig;
using Hedwig.Data;

namespace HedwigTests
{
    public class TestStartup : Startup
    {
        public TestStartup(IConfiguration configuration) : base(configuration)
        { }
        protected override void SetupDbServices(IServiceCollection services)
        {
            services.AddDbContext<HedwigContext>(options =>
               {
                    SqliteConnection connection = new SqliteConnection("Data Source=:memory");
                    connection.Open();
                    options.UseSqlite(connection);
               }
            );
        }
    }
}
