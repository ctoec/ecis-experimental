using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;

// GraphQL Support
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using GraphQL.Authorization;
using GraphQL.Validation;
using Hedwig.Schema;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using System.Collections.Generic;
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
			var wingedKeysUri = Configuration.GetValue<string>("WingedKeysUri");
			services.ConfigureAuthentication(wingedKeysUri);
			services.ConfigureAuthorization();
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hedwig API", Version = "v1" });
				c.DescribeAllEnumsAsStrings();
				c.TagActionsBy(api => new List<string> { "Hedwig" });
				c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
					Name = "Authorization",
					In = ParameterLocation.Header,
					Type = SecuritySchemeType.ApiKey,
					Scheme = "Bearer"
				});
				c.AddSecurityRequirement(new OpenApiSecurityRequirement()
				{
					{
						new OpenApiSecurityScheme
						{
							Reference = new OpenApiReference
							{
								Type = ReferenceType.SecurityScheme,
								Id = "Bearer"
							},
							Scheme = "oauth2",
							Name = "Bearer",
							In = ParameterLocation.Header
						},
						new List<string> { }
					}
				});
			});
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
				IdentityModelEventSource.ShowPII = true;
			}

			app.UseHttpsRedirection();

			app.UseSwagger();
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
