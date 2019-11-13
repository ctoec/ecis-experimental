using Xunit;
using System.Collections.Generic;
using Moq;
using Hedwig.Security;
using System.Security.Claims;
using HedwigTests.Helpers;
using Microsoft.AspNetCore.Hosting;

namespace HedwigTests.Security
{
    public class DevelopmentRequirementTests
    {
        [Fact]
        public async void When_Development_Authorize_Produces_No_Error()
        {
          // If
          var env = new Mock<IHostingEnvironment>();
          env.Setup(_env => _env.EnvironmentName).Returns("Development");
          var requirement = new DevelopmentRequirement(env.Object);
          var context = new AuthorizationContext();
          context.User = AuthorizationRequirementHelper.CreatePrincipal("password");

          // When
          await requirement.Authorize(context);

          // Then
          Assert.False(context.HasErrors);
        }

        [Fact]
        public async void When_Not_Development_Authorize_Produces_Error()
        {
          // If
          var env = new Mock<IHostingEnvironment>();
          env.Setup(_env => _env.EnvironmentName).Returns("Not Development");
          var requirement = new DevelopmentRequirement(env.Object);
          var context = new AuthorizationContext();
          context.User = AuthorizationRequirementHelper.CreatePrincipal("password");

          // When
          await requirement.Authorize(context);

          // Then
          Assert.True(context.HasErrors);
        }
    }
}