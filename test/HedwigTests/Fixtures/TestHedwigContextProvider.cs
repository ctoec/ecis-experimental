using System;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Hedwig.Configuration;
using Hedwig.Data;


namespace HedwigTests.Fixtures
{
	public class TestHedwigContextProvider : IDisposable
	{
		public HedwigContext Context { get; private set; }

		public Mock<HedwigContext> ContextMock { get; private set; }
		public IHttpContextAccessor HttpContextAccessor { get; private set; }

		public TestHedwigContextProvider(bool callBase = true)
		{
			var configuration = EnvironmentConfiguration.GetIConfigurationRoot();
			var optionsBuilder = new DbContextOptionsBuilder<HedwigContext>()
				.UseSqlServer(configuration.GetConnectionString("HEDWIG"))
				.EnableSensitiveDataLogging();

			if (TestEnvironmentFlags.ShouldLogSQL())
			{
				var loggerFactory = LoggerFactory.Create(b => b.AddConsole());
				optionsBuilder.UseLoggerFactory(loggerFactory);
			}

			HttpContextAccessor = new TestHttpContextAccessorProvider().HttpContextAccessor;

			ContextMock = new Mock<HedwigContext>(optionsBuilder.Options, HttpContextAccessor);
			ContextMock.CallBase = callBase;
			ContextMock.Object.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
			Context = ContextMock.Object;
		}

		public void Dispose()
		{
			Context?.Dispose();
		}
	}
}
