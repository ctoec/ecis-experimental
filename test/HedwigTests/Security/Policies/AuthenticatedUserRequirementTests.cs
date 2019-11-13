using Xunit;
using System.Collections.Generic;
using Moq;
using Hedwig.Security;
using System.Security.Claims;
using HedwigTests.Helpers;

namespace HedwigTests.Security
{
    public class AuthenticatedUserRequirementTests
    {
        [Fact]
        public async void When_Authenticated_User_Authorize_Produces_No_Error()
        {
          // If
          var requirement = new AuthenticatedUserRequirement();
          var context = new AuthorizationContext();
          context.User = AuthorizationRequirementHelper.CreatePrincipal("password");

          // When
          await requirement.Authorize(context);

          // Then
          Assert.False(context.HasErrors);
        }

        [Fact]
        public async void When_Not_Authenticated_User_Authorize_Produces_Error()
        {
          // If
          var requirement = new AuthenticatedUserRequirement();
          var context = new AuthorizationContext();
          context.User = AuthorizationRequirementHelper.CreatePrincipal();

          // When
          await requirement.Authorize(context);

          // Then
          Assert.True(context.HasErrors);
        }
    }
}