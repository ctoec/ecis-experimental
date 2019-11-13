using Xunit;
using System.Collections.Generic;
using Moq;
using Hedwig.Security;
using System.Security.Claims;
using HedwigTests.Helpers;

namespace HedwigTests.Security
{
    public class DeveloperUserRequirementTests
    {
        [Fact]
        public async void When_Developer_User_Authorize_Produces_No_Error()
        {
          // If
          var requirement = new DeveloperUserRequirement();
          var context = new AuthorizationContext();
          var claims = new Dictionary<string, string>() {
            { "role", "developer" }
          };
          context.User = AuthorizationRequirementHelper.CreatePrincipal("password", claims);

          // When
          await requirement.Authorize(context);

          // Then
          Assert.False(context.HasErrors);
        }

        [Fact]
        public async void When_Not_Developer_User_Authorize_Produces_Error()
        {
          // If
          var requirement = new DeveloperUserRequirement();
          var context = new AuthorizationContext();
          var claims = new Dictionary<string, string>() {
            { "role", "not developer" }
          };
          context.User = AuthorizationRequirementHelper.CreatePrincipal("password", claims);

          // When
          await requirement.Authorize(context);

          // Then
          Assert.True(context.HasErrors);
        }
    }
}