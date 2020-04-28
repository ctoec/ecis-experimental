using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Hedwig;
using Hedwig.Data;

namespace Hedwig.Configuration
{
	public static class AppExtensions
	{
		public static void UpdateDatabase(this IApplicationBuilder app)
		{
			using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
			{
				using (var context = serviceScope.ServiceProvider.GetService<HedwigContext>())
				{
					var logger = serviceScope.ServiceProvider.GetService<ILogger<Program>>();
					try
					{
						logger.LogInformation("Attempting to apply migrations");
						context.Database.Migrate();
						logger.LogInformation("Succesffully applied migrations");
					}
					catch (Exception ex)
					{
						logger.LogError(ex, "An error occurred while trying to apply migrations.");
					}
				}
			}
		}
	}
}
