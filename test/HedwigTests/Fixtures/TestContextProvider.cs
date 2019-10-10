using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Hedwig.Data;

namespace HedwigTests.Fixtures
{
	public class TestContextProvider : IDisposable
	{
		public TestHedwigContext Context { get; private set; }

		public TestContextProvider()
		{
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
			Context = new TestHedwigContext(options);
		}
		public void Dispose()
		{
			Context?.Dispose();
		}
	}
}
