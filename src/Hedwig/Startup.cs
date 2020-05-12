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
			services.ConfigureAuthentication(
				EnvironmentConfiguration.IsProduction(),
				Configuration.GetValue<string>("WingedKeysUri")
			);
			services.ConfigureAuthorization();
			services.ConfigureValidation();
			services.ConfigureHostedServices();
			services.AddSingleton<IDateTime, SystemDateTime>();
			if (EnvironmentConfiguration.IsDevelopment())
			{
				// We use this to generate a schema for the API.
				// We create the generated client-code for interacting
				// with the API against the generated schema exposed by
				// this service extension. Currently, it is guarded to
				// only execute in development. If this API becomes a
				// public resource and/or government requirements apply,
				// the guard can be removed to include it with the
				// production application.
				//
				// Connected to note on app.UseSwagger()
				services.ConfigureSwagger();
			}
			services.AddHttpContextAccessor();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			var isAutomaticallyApplyMigrations = EnvironmentConfiguration.GetEnvironmentVariableFromAppSettings("Database:AutomaticallyApplyMigrations") == "true";
			if (isAutomaticallyApplyMigrations)
			{
				app.UpdateDatabase();
			}

			if (!env.IsProduction())
			{
				app.UseDeveloperExceptionPage();
				IdentityModelEventSource.ShowPII = true;
				app.UseCors();
			}

			app.UseHttpsRedirection();

			if (env.IsDevelopment())
			{
				// Creates an endpoint for viewing the generated
				// JSON schema of the API.
				//
				// Connected to note on services.ConfigureSwagger()
				app.UseSwagger();
			}
			app.UseRouting();

			app.UseAuthentication();
			app.UseAuthorization();

			// Use SPA static files in all non-dev environments
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

				// If we are development, that means we aren't serving SPA files
				// as static, compiled resources. So we need to forward requests a
				// development server.
				if (env.IsDevelopment())
				{
					var isDocker = Environment.GetEnvironmentVariable("DOCKER_DEVELOPMENT");
					// If we are using docker (compose), the client container will serve
					// responses for us. We need to forward to its hostname.
					if (isDocker == "true")
					{
						string CLIENT_HOST = Environment.GetEnvironmentVariable("CLIENT_HOST") ?? "http://localhost:3000";
						spa.UseProxyToSpaDevelopmentServer(CLIENT_HOST);
					}
					// If we aren't using docker, we need .NET to create a server for us
					// to serve responses.
					else
					{
						// Note: While the parameter is called npmScript it will also run yarn
						// scripts. Specifically, it will run the corresponding package.json 
						// script and provided the referenced executable exists on the path
						// the script will run.
						spa.UseReactDevelopmentServer(npmScript: "start");
					}
				}
			});

		}
	}
}
