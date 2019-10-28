using Microsoft.AspNetCore.Authorization;

namespace Hedwig.Security
{
    public class Permissions
    {
      // DevelopmentRequirement needs DI access to IHostingEnvironment
      private readonly DevelopmentRequirement _developmentRequirement;

      public Permissions(
        DevelopmentRequirement developmentRequirement
      )
      {
        _developmentRequirement = developmentRequirement;
      }

      public AuthorizationSettings GetAuthorizationSettings()
      {
        var authSettings = new AuthorizationSettings();

        authSettings.AddPolicy("IsAuthenticatedUserPolicy", policy =>
          policy.AddRequirement(new AuthenticatedUserRequirement()));

        authSettings.AddPolicy("IsCurrentUserPolicy", policy =>
          policy.AddRequirement(new CurrentUserRequirement()));

        authSettings.AddPolicy("IsDeveloperInDevPolicy", policy =>
          policy.AddRequirement(new DeveloperUserRequirement())
            .AddRequirement(_developmentRequirement));

        authSettings.AddPolicy("IsTestModePolicy", policy =>
          policy.AddRequirement(new TestModeRequirement())
            .AddRequirement(_developmentRequirement));

        return authSettings;
      }
    }
}