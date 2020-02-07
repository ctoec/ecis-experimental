using System;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Hedwig.Data;

namespace Hedwig
{
	public class Program
	{
		protected Program() { }

		public static void Main(string[] args)
		{
			var host = CreateHostBuilder(args).Build();
			var environment = GetEnvironmentNameFromAppSettings();

				if (environment != Environments.Production) {
				using (var scope = host.Services.CreateScope())
				{
					var services = scope.ServiceProvider;
					var logger = services.GetRequiredService<ILogger<Program>>();
					logger.LogInformation("Detected environment " + environment);

					logger.LogError("DevOps sample logger error event for Sentry");
					logger.LogCritical("DevOps sample logger critial event for Sentry");

					try
					{
						var context = services.GetRequiredService<HedwigContext>();
						var initializer = new DbInitializer(context);
						initializer.Initialize();
					}
					catch (Exception ex)
					{
						logger.LogError(ex, "An error occurred while seeding the database.");
					}
				}
			}

			host.Run();
		}

		public static IWebHostBuilder CreateHostBuilder(string[] args) {
			var environment = GetEnvironmentNameFromAppSettings();
			return WebHost.CreateDefaultBuilder(args)
			.ConfigureLogging((context, logging) =>
			{
				logging.ClearProviders();
				logging.AddConfiguration(context.Configuration.GetSection("Logging"));
				logging.AddConsole();
				logging.AddDebug();

				if (environment != Environments.Development)
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

		public static IConfigurationRoot GetIConfigurationRoot()
		{
		return new ConfigurationBuilder()
			.SetBasePath(Directory.GetCurrentDirectory())
			.AddJsonFile("appsettings.json", optional: true)
			.AddEnvironmentVariables()
			.Build();
		}

		private static string GetEnvironmentNameFromAppSettings(string defaultValue = null)
		{
			return Program.GetIConfigurationRoot()
				.GetValue<string>("EnvironmentName", defaultValue ?? "Development");
		}
	}
}
