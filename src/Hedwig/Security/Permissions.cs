using GraphQL.Authorization;
using Microsoft.AspNetCore.Authorization;

namespace Hedwig.Security
{
    public static class Permissions
    {
      public static AuthorizationSettings GetAuthorizationSettings()
      {
        var authSettings = new AuthorizationSettings();

        authSettings.AddPolicy("IsAuthenticatedUserPolicy", policy =>
          policy.AddRequirement(new AuthenticatedUserRequirement()));

        return authSettings;
      }
    }
}