using System;
using Hedwig.Configuration;
using Hedwig.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Hedwig
{
	public class Program
	{
		protected Program() { }

		public static void Main(string[] args)
		{
			var host = CreateHostBuilder(args).Build();
			var isSeedData = EnvironmentConfiguration.GetEnvironmentVariableFromAppSettings("Database:SeedData") == "true";

			// Only seed data if appsettings flag is set and we are not in production
			if (isSeedData && !EnvironmentConfiguration.IsProduction())
			{
				using (var scope = host.Services.CreateScope())
				{
					var services = scope.ServiceProvider;
					var logger = services.GetRequiredService<ILogger<Program>>();

					try
					{
						using (var context = services.GetRequiredService<HedwigContext>())
						{
							var initializer = new DbInitializer(context);
							logger.LogInformation("Attempting to seed database");
							initializer.Initialize();
							logger.LogInformation("Successfully seeded database");
						}
					}
					catch (Exception ex)
					{
						logger.LogError(ex, "An error occurred while seeding the database.");
					}
				}
			}

			host.Run();
		}

		public static IWebHostBuilder CreateHostBuilder(string[] args)
		{
			var environment = EnvironmentConfiguration.GetEnvironmentVariableFromAppSettings("EnvironmentName");
			return WebHost.CreateDefaultBuilder(args)
			.ConfigureLogging((context, logging) =>
			{
				logging.ClearProviders();
				logging.AddConfiguration(context.Configuration.GetSection("Logging"));
				logging.AddConsole();
				logging.AddDebug();

				if (!EnvironmentConfiguration.IsDevelopment())
				{
					logging.AddAWSProvider(context.Configuration.GetAWSLoggingConfigSection());
					logging.Services.Configure<Sentry.Extensions.Logging.SentryLoggingOptions>(context.Configuration.GetSection("Sentry"));
					logging.AddSentry();
				}

			})
			.UseSentry()
			.UseEnvironment(environment)
			.UseStartup<Startup>();
		}
	}
}
