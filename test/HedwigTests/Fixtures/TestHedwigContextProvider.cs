using System;
using System.Security.Principal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Hedwig.Data;
using Moq;
using Hedwig;
using Microsoft.Extensions.Configuration;

namespace HedwigTests.Fixtures
{
	public class TestHedwigContextProvider : IDisposable
	{
		public HedwigContext Context { get; private set; }

		public Mock<HedwigContext> ContextMock { get; private set; }
		public IHttpContextAccessor HttpContextAccessor { get; private set; }

		public TestHedwigContextProvider(bool callBase = true)
		{
			var configuration = Program.GetIConfigurationRoot();
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
			Context = ContextMock.Object;
		}

		public void Dispose()
		{
			Context?.Dispose();
		}
	}
}
