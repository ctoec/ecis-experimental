using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Hedwig.Data;

namespace Hedwig
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var host = CreateWebHostBuilder(args).Build();

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

		public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
			  .ConfigureLogging((context, logging) =>
				{
				  logging.ClearProviders();
				  logging.AddConfiguration(context.Configuration.GetSection("Logging"));
				  logging.AddConsole();
				  logging.AddDebug();
				  logging.AddAWSProvider();
				})
				.UseStartup<Startup>();
	}
}
