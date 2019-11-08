using System;
using System.Security.Principal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Hedwig.Data;
using Moq;

namespace HedwigTests.Fixtures
{
	public class TestContextProvider : IDisposable
	{
		public TestHedwigContext Context { get; private set; }
		public IHttpContextAccessor HttpContextAccessor { get; private set; }

		public TestContextProvider(bool retainObjects = false)
		{
			var services = new ServiceCollection()
				.AddEntityFrameworkSqlServer();

			if (TestEnvironmentFlags.ShouldLogSQL()) {
				services.AddLogging(configure => configure.AddConsole());
			}
			
			var options = new DbContextOptionsBuilder<HedwigContext>()
				.UseSqlServer(Environment.GetEnvironmentVariable("SQLCONNSTR_HEDWIG"))
				.EnableSensitiveDataLogging()
				.UseInternalServiceProvider(services.BuildServiceProvider())
				.Options;

           	HttpContextAccessor = new TestHttpContextAccessorProvider().HttpContextAccessor;
			Context = new TestHedwigContext(options, HttpContextAccessor, retainObjects);
		}
		public void Dispose()
		{
			Context?.Dispose();
		}
	}
}
