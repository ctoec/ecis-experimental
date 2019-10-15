using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Hedwig.Data;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using Hedwig.Schema.Queries;
using Hedwig.Schema;
using GraphQL;
using GraphQL.Server;

namespace Hedwig
{
	public static class ServiceExtensions
	{
		public static void ConfigureSqlServer(this IServiceCollection services, string connectionString)
		{
			services.AddDbContext<HedwigContext>(options =>
				options.UseSqlServer(connectionString)
			);
		}
		public static void ConfigureCors(this IServiceCollection services)
		{
			services.AddCors(options =>
			{
				options.AddPolicy("AllowAll", builder =>
				{
					builder.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowAnyOrigin();
				});
			});
		}

		public static void ConfigureSpa(this IServiceCollection services)
		{
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/build";
			});
		}

		public static void ConfigureRepositories(this IServiceCollection services)
		{
			services.AddScoped<IChildRepository, ChildRepository>();
			services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
			services.AddScoped<IFamilyDeterminationRepository, FamilyDeterminationRepository>();
			services.AddScoped<IFamilyRepository, FamilyRepository>();
			services.AddScoped<IFundingRepository, FundingRepository>();
			services.AddScoped<IOrganizationRepository, OrganizationRepository>();
			services.AddScoped<IReportRepository, ReportRepository>();
			services.AddScoped<ISiteRepository, SiteRepository>();
			services.AddScoped<IUserRepository, UserRepository>();
		}

		public static void ConfigureGraphQL(this IServiceCollection services)
		{
			// Add Types
			services.AddScoped<CdcReportType>();
			services.AddScoped<ChildType>();
			services.AddScoped<EnrollmentType>();
			services.AddScoped<FamilyDeterminationType>();
			services.AddScoped<FamilyType>();
			services.AddScoped<FundingType>();
			services.AddScoped<OrganizationType>();
			services.AddScoped<ReportType>();
			services.AddScoped<SiteType>();
			services.AddScoped<UserType>();

			// Add Queries
			services.AddScoped<IAppSubQuery, EnrollmentQuery>();
			services.AddScoped<IAppSubQuery, UserQuery>();
			services.AddScoped<IAppSubQuery, ChildQuery>();

			services.AddScoped<IDependencyResolver>(s => new FuncDependencyResolver(s.GetRequiredService));
			services.AddScoped<AppSchema>();

			services.AddGraphQL(o => { o.ExposeExceptions = false; })
				.AddGraphTypes(ServiceLifetime.Scoped)
				.AddDataLoader()
				.AddUserContextBuilder<RequestContext>(RequestContext.RequestContextCreator);
		}
	}
}
