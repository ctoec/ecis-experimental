using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Hedwig.Configuration;
using Hedwig.Utilities;

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
			services.ConfigureFilters();
			services.ConfigureControllers();
			services.ConfigureSpa();
			services.ConfigureMapping();
			services.ConfigureRepositories();
			services.ConfigureAuthentication(Configuration.GetValue<string>("WingedKeysUri"));
			services.ConfigureAuthorization();
			services.ConfigureValidation();
			services.ConfigureHostedServices();
			services.AddSingleton<IDateTime, SystemDateTime>();
			services.ConfigureSwagger();
			services.AddHttpContextAccessor();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			var isAutomaticallyApplyMigrations = EnvironmentConfiguration.GetEnvironmentVariableFromAppSettings("Database:AutomaticallyApplyMigrations") == "true";
			if (isAutomaticallyApplyMigrations)
			{
				app.UpdateDatabase();
			}

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				IdentityModelEventSource.ShowPII = true;
				app.UseCors();
			}

			app.UseHttpsRedirection();

			app.UseSwagger();
			app.UseRouting();

			app.UseAuthentication();
			app.UseAuthorization();

			if (!env.IsDevelopment())
			{
				app.UseSpaStaticFiles();
			}

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					var isDocker = Environment.GetEnvironmentVariable("DOCKER_DEVELOPMENT");
					if (isDocker == "true")
					{
						string CLIENT_HOST = Environment.GetEnvironmentVariable("CLIENT_HOST") ?? "http://localhost:3000";
						spa.UseProxyToSpaDevelopmentServer(CLIENT_HOST);
					}
					else
					{
						spa.UseReactDevelopmentServer(npmScript: "start");
					}
				}
			});

		}
	}
}
