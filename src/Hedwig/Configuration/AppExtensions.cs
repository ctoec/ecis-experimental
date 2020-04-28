using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
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
					context.Database.Migrate();
				}
			}
		}
	}
}
