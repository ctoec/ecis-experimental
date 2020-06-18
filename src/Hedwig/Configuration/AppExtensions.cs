using System;
using Hedwig;
using Hedwig.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

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
						logger.LogInformation("Succesfully applied migrations");
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
