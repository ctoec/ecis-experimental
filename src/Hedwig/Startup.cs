using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using Hedwig.Data;
using Microsoft.EntityFrameworkCore;
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
        public virtual void ConfigureServices(IServiceCollection services)
        {
            SetupDbServices(services);
            services.ConfigureCors();
            services.ConfigureSpa();
            services.ConfigureRepositories();
            services.ConfigureGraphQL();
        }
        protected virtual void SetupDbServices(IServiceCollection services)
        {
            services.AddDbContext<HedwigContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("HEDWIG"))
            );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app, IHostingEnvironment env)
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
