using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Hedwig.Data;

namespace Hedwig
{
	public class Program
	{
		protected Program() {}

		public static void Main(string[] args)
		{
			var host = CreateHostBuilder(args).Build();

			using (var scope = host.Services.CreateScope())
			{
				var services = scope.ServiceProvider;
				try
				{
					var context = services.GetRequiredService<HedwigContext>();
					DbInitializer.Initialize(context);
				}
				catch (Exception ex)
				{
					var logger = services.GetRequiredService<ILogger<Program>>();
					logger.LogError(ex, "An error occurred while seeding the database.");
				}
			}

			host.Run();
		}

		public static IHostBuilder CreateHostBuilder(string[] args) =>
			Host.CreateDefaultBuilder(args)
				.ConfigureLogging((context, logging) =>
				{
				  logging.ClearProviders();
				  logging.AddConfiguration(context.Configuration.GetSection("Logging"));
				  logging.AddConsole();
				  logging.AddDebug();

					var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
					var isDevelopment = environment == Microsoft.Extensions.Hosting.Environments.Development;
				  if (!isDevelopment)
				  {
  					logging.AddAWSProvider();
				  }

				})
				.ConfigureWebHostDefaults(webBuilder =>
				{
					webBuilder.UseStartup<Startup>();
				});
	}

}
