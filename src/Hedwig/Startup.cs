using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

// GraphQL Support
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using GraphQL.Authorization;
using GraphQL.Validation;
using Hedwig.Schema;
using Microsoft.AspNetCore.Server.Kestrel.Core;
// End GraphQL Support

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
			services.ConfigureAuthorization();
			services.AddHttpContextAccessor();

			// GraphQL Support
			services.Configure<KestrelServerOptions>(options =>
			{
					options.AllowSynchronousIO = true;
			});
			services.ConfigureGraphQL();
			services.ConfigureGraphQLAuthorization();
			// GraphQL Support
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseCors();

			app.UseAuthentication();
			app.UseAuthorization();

			// GraphQL Support
			app.UseGraphQL<AppSchema>();
			app.UseGraphQLPlayground(options: new GraphQLPlaygroundOptions());
			// End GraphQL Support

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
					string CLIENT_HOST = Environment.GetEnvironmentVariable("CLIENT_HOST") ?? "http://localhost:3000";
					spa.UseProxyToSpaDevelopmentServer(CLIENT_HOST);
				}
			});
		}
	}
}
