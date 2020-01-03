using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.OpenApi.Models;

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
      services.ConfigureAuthentication(Configuration.GetValue<string>("WingedKeysUri"));
      services.ConfigureAuthorization();
      services.ConfigureValidation();
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
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
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
          string CLIENT_HOST = Environment.GetEnvironmentVariable("CLIENT_HOST") ?? "http://localhost:3000";
          spa.UseProxyToSpaDevelopmentServer(CLIENT_HOST);
        }
      });

    }
  }
}
