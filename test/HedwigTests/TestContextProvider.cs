using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Debug;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Hedwig.Data;

namespace HedwigTests
{
    public class TestContextProvider : IDisposable
    {
        public HedwigContext Context { get; private set; }

        public TestContextProvider()
        {
            if (Context is null) {
                var services = new ServiceCollection()
                    .AddEntityFrameworkSqlServer();

                if (Environment.GetEnvironmentVariable("SQL_LOGGING") != null) {
                    services.AddLogging(configure => configure.AddConsole());
                }
                
                var options = new DbContextOptionsBuilder<HedwigContext>()
                    .UseSqlServer(Environment.GetEnvironmentVariable("SQLCONNSTR_HEDWIG"))
										.EnableSensitiveDataLogging()
                    .UseInternalServiceProvider(services.BuildServiceProvider())
                    .Options;
                Context = new HedwigContext(options);
                Context.Database.Migrate();
            }
        }
        public void Dispose()
        {
            Context.Database.EnsureDeleted();
            Context?.Dispose();
        }
    }
}
