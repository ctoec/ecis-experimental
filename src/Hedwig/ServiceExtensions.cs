using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Hedwig.Data;
using Hedwig.Repositories;
using Hedwig.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.IdentityModel.Tokens.Jwt;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Hedwig.Models;
using Hedwig.HostedServices;
using Hedwig.Filters;
using Hedwig.Filters.Attributes;
using AutoMapper;

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

		public static void ConfigureMapping(this IServiceCollection services)
		{
			services.AddAutoMapper(
				typeof(EnrollmentProfile),
				typeof(ChildProfile),
				typeof(FundingProfile),
				typeof(FundingSpaceProfile),
				typeof(FamilyDeterminationProfile),
				typeof(OrganizationProfile),
				typeof(SiteProfile)
			);
		}

		public static void ConfigureRepositories(this IServiceCollection services)
		{
			services.AddScoped<IChildRepository, ChildRepository>();
			services.AddScoped<IC4KCertificateRepository, C4KCertificateRepository>();
			services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();
			services.AddScoped<IFamilyDeterminationRepository, FamilyDeterminationRepository>();
			services.AddScoped<IFamilyRepository, FamilyRepository>();
			services.AddScoped<IFundingRepository, FundingRepository>();
			services.AddScoped<IOrganizationRepository, OrganizationRepository>();
			services.AddScoped<IReportingPeriodRepository, ReportingPeriodRepository>();
			services.AddScoped<IReportRepository, ReportRepository>();
			services.AddScoped<ISiteRepository, SiteRepository>();
			services.AddScoped<IUserRepository, UserRepository>();
			services.AddScoped<IPermissionRepository, PermissionRepository>();
		}

		public static void ConfigureAuthentication(this IServiceCollection services, string wingedKeysUri)
		{
			JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
					{
						options.Authority = wingedKeysUri;
						options.Audience = "hedwig_backend";
						options.BackchannelHttpHandler = new HttpClientHandler
						{
							ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
						};
					});
		}

		public static void ConfigureAuthorization(this IServiceCollection services)
		{
			services.AddScoped<IAuthorizationHandler, OrganizationAccessHandler>();
			services.AddScoped<IAuthorizationHandler, SingleSiteAccessHandler>();
			services.AddScoped<IAuthorizationHandler, MultipleSiteAccessHandler>();
			services.AddScoped<IAuthorizationHandler, NoSiteSpecifiedAccessHandler>();
			services.AddAuthorization(options =>
			{
				options.AddPolicy(
						OrganizationAccessPolicyProvider.NAME,
						OrganizationAccessPolicyProvider.GetPolicy()
					);
				options.AddPolicy(
						SiteAccessPolicyProvider.NAME,
						SiteAccessPolicyProvider.GetPolicy()
					);
			});
		}

		public static void ConfigureFilters(this IServiceCollection services)
		{
			services.AddScoped<IHedwigActionFilter<DTOProjectionFilterAttribute>, DTOProjectionFilter>();
			services.AddScoped<IHedwigActionFilter<ValidateEntityFilterAttribute>, ValidateEntityFilter>();
			services.AddScoped<HedwigActionFilterDispatcher>();
		}

		public static void ConfigureControllers(this IServiceCollection services)
		{
			services
			.AddControllers(config =>
			{
				config.Filters.Add<HedwigActionFilterDispatcher>();
			})
			.AddNewtonsoftJson(options =>
				{
					options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
				});
		}

		public static void ConfigureValidation(this IServiceCollection services)
		{
			// Enrollment
			services.AddScoped<IValidationRule<Enrollment>, ChildIsValid>();
			services.AddScoped<IValidationRule<Enrollment>, AgeGroupRequired>();
			services.AddScoped<IValidationRule<Enrollment>, EntryRequired>();
			services.AddScoped<IValidationRule<Enrollment>, FundingsAreValid>();

			// Child
			services.AddScoped<IValidationRule<Child>, FamilyIsValid>();
			services.AddScoped<IValidationRule<Child>, FamilyIdRequired>();
			services.AddScoped<IValidationRule<Child>, BirthCertificateIdRequired>();
			services.AddScoped<IValidationRule<Child>, BirthTownRequired>();
			services.AddScoped<IValidationRule<Child>, BirthStateRequired>();
			services.AddScoped<IValidationRule<Child>, BirthdateRequired>();
			services.AddScoped<IValidationRule<Child>, C4KCertificatesAreValid>();
			services.AddScoped<IValidationRule<Child>, EthnicityRequired>();
			services.AddScoped<IValidationRule<Child>, FirstNameRequired>();
			services.AddScoped<IValidationRule<Child>, LastNameRequired>();
			services.AddScoped<IValidationRule<Child>, RaceRequired>();
			services.AddScoped<IValidationRule<Child>, GenderMustBeSpecified>();
			services.AddScoped<IValidationRule<Child>, IfC4K_C4KFamilyCaseNumberRequired>();

			// Family
			services.AddScoped<IValidationRule<Family>, MostRecentDeterminationIsValid>();
			services.AddScoped<IValidationRule<Family>, AddressLine1Required>();
			services.AddScoped<IValidationRule<Family>, StateRequired>();
			services.AddScoped<IValidationRule<Family>, TownRequired>();
			services.AddScoped<IValidationRule<Family>, ZipRequired>();

			// Family Determination
			services.AddScoped<IValidationRule<FamilyDetermination>, IfDisclosed_DeterminationDateRequired>();
			services.AddScoped<IValidationRule<FamilyDetermination>, IfDisclosed_IncomeRequired>();
			services.AddScoped<IValidationRule<FamilyDetermination>, IfDisclosed_NumberOfPeopleRequired>();
			services.AddScoped<IValidationRule<FamilyDetermination>, IfEnrollmentFunded_NotDeterminedFalse>();
			// Temporarily disable 1-year requirement for family determination (COVID-19 extenuating circumstances, etc)
			// services.AddScoped<IValidationRule<FamilyDetermination>, IfEnrollmentFunded_DeterminationDateValid>();

			// Reports
			services.AddScoped<IValidationRule<CdcReport>, EnrollmentsAreValid>();

			// Funding
			services.AddScoped<IValidationRule<Funding>, SourceRequired>();
			services.AddScoped<IValidationRule<Funding>, FundingTimelinesAreValid>();

			// C4K Certificates
			services.AddScoped<IValidationRule<C4KCertificate>, CertificateStartDateRequired>();

			// Register Non-blocking validator
			services.AddScoped<INonBlockingValidator, NonBlockingValidator>();

			// Register ValidateEntityFilterAttribute filter
			services.AddScoped<ValidateEntityFilterAttribute>();
		}

		public static void ConfigureHostedServices(this IServiceCollection services)
		{
			services.AddScoped<CdcReportGeneratorScopedService>();
			services.AddHostedService<DailyServiceExecutor>();
		}
	}
}
