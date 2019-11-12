using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Hedwig
{
	public class Startup
	{
		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public virtual void ConfigureServices(IServiceCollection services)
		{
			services.ConfigureSqlServer(Configuration.GetConnectionString("HEDWIG"));
			services.ConfigureCors();
			services.ConfigureControllers();
			services.ConfigureSpa();
			services.ConfigureRepositories();
			services.ConfigureAuthentication();
			services.AddHttpContextAccessor();

			services.AddControllers();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			//if (env.IsDevelopment())
			//{
				app.UseDeveloperExceptionPage();
			//}

			//if (env.IsDevelopment())
			//{
			//	app.UseSpaStaticFiles();
			//}

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseCors();

			app.UseAuthentication();
			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				//if (env.IsDevelopment())
				//{
				//	spa.UseProxyToSpaDevelopmentServer("http://client:3000");
				//}
			});
		}
	}
}
