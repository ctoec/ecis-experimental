using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using Hedwig.Data;
using Hedwig.Repositories;
using Microsoft.EntityFrameworkCore;
using GraphQL;
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using Hedwig.Schema;

namespace Hedwig
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddDbContext<HedwigContext>(options =>
					options.UseSqlServer(Configuration.GetConnectionString("HEDWIG"))
			);
			services.AddCors(options =>
			{
				options.AddPolicy("AllowAll",
					builder =>
					{
						builder
						.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowAnyOrigin();
					}
				);
			});
			services.AddScoped<IChildRepository, ChildRepository>();
			services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
			services.AddScoped<IFamilyDeterminationRepository, FamilyDeterminationRepository>();
			services.AddScoped<IFamilyRepository, FamilyRepository>();
			services.AddScoped<IFundingRepository, FundingRepository>();
			services.AddScoped<ISiteRepository, SiteRepository>();
			services.AddScoped<IUserRepository, UserRepository>();

			services.AddScoped<ChildType>();
			services.AddScoped<EnrollmentType>();
			services.AddScoped<FamilyDeterminationType>();
			services.AddScoped<FamilyType>();
			services.AddScoped<FundingType>();
			services.AddScoped<SiteType>();
			services.AddScoped<UserType>();

			services.AddScoped<IAppSubQuery, EnrollmentQuery>();
			services.AddScoped<IAppSubQuery, UserQuery>();

			services.AddScoped<IDependencyResolver>(s => new FuncDependencyResolver(s.GetRequiredService));
			services.AddScoped<AppSchema>();

			services.AddGraphQL(o => { o.ExposeExceptions = false; })
				.AddGraphTypes(ServiceLifetime.Scoped)
				.AddDataLoader();

			// In production, the React files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});
		}
		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
				app.UseCors("AllowAll");
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();

			app.UseGraphQL<AppSchema>();
			app.UseGraphQLPlayground(options: new GraphQLPlaygroundOptions());

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
