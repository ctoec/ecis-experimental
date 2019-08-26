using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ecis2.Data;
using ecis2.Repositories;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using GraphQL;
using GraphQL.Server;
using GraphQL.Server.Ui.Playground;
using ecis2.Schema;

namespace ecis2
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
			services.AddDbContext<EcisContext>(options =>
				options.UseSqlite("Data Source=ecis2.db"));

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

			services.AddScoped<IDependencyResolver>(s => new FuncDependencyResolver(s.GetRequiredService));
			services.AddScoped<AppSchema>();

			services.AddGraphQL(o => { o.ExposeExceptions = false; })
				.AddGraphTypes(ServiceLifetime.Scoped)
				.AddDataLoader();

			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
				.AddJsonOptions(options => options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);

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

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
				}
			});
		}
	}
}
