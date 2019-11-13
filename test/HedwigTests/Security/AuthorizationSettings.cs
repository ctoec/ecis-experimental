using Xunit;
using System.Collections.Generic;
using Moq;
using Hedwig.Security;

namespace HedwigTests.Security
{
    public class AuthorizationSettingsTests
    {
        [Fact]
        public void When_Nonexistant_Policy_GetPolicy_Returns_Null()
        {
          // If
          var authSettings = new AuthorizationSettings();

          // When
          var policy = authSettings.GetPolicy("DoesNotExist");

          // Then
          Assert.Null(policy);
        }

        [Fact]
        public void When_Existant_Policy_GetPolicy_Returns_Policy()
        {
          // If
          var authSettings = new AuthorizationSettings();
          var mockPolicy = new Mock<IAuthorizationPolicy>();
          authSettings.AddPolicy("Policy", mockPolicy.Object);

          // When
          var policy = authSettings.GetPolicy("Policy");

          // Then
          Assert.Equal<IAuthorizationPolicy>(mockPolicy.Object, policy);
        }

        [Fact]
        public void When_Existant_Policy_Via_Builder_GetPolicy_Returns_Policy()
        {
          // If
          var authSettings = new AuthorizationSettings();
          var mockRequirement = new Mock<IAuthorizationRequirement>();
          authSettings.AddPolicy("Policy", _ => 
            _.AddRequirement(mockRequirement.Object));
          
          // When
          var policy = authSettings.GetPolicy("Policy");
          var requirementEnumator = policy.Requirements.GetEnumerator();
          requirementEnumator.MoveNext();
          var requirement = requirementEnumator.Current;

          // Then
          Assert.Equal<IAuthorizationRequirement>(mockRequirement.Object, requirement);
        }

        [Fact]
        public void When_Nonexistant_Policy_GetPolicies_Returns_Empty_Enumerable()
        {
          // If
          var authSettings = new AuthorizationSettings();

          // When
          var policy = authSettings.GetPolicies(new string[] {
            "DoesNotExist"
          });

          // Then
          Assert.Empty(policy);
        }

        [Fact]
        public void When_Existant_Policies_GetPolicies_Returns_Policies()
        {
          // If
          var authSettings = new AuthorizationSettings();
          var mockPolicy1 = new Mock<IAuthorizationPolicy>();
          var mockPolicy2 = new Mock<IAuthorizationPolicy>();
          var mockPolicies = new List<IAuthorizationPolicy> {
            mockPolicy1.Object,
            mockPolicy2.Object
          };
          authSettings.AddPolicy("Policy1", mockPolicy1.Object);
          authSettings.AddPolicy("Policy2", mockPolicy2.Object);

          // When
          var policies = authSettings.GetPolicies(new string[] {
            "Policy1",
            "Policy2"
          });

          // Then
          Assert.Equal(mockPolicies, policies);
        }

        [Fact]
        public void When_Both_Non_And_Existant_Policies_GetPolicies_Returns_Only_Existant_Policies()
        {
          // If
          var authSettings = new AuthorizationSettings();
          var mockPolicy1 = new Mock<IAuthorizationPolicy>();
          var mockPolicies = new List<IAuthorizationPolicy> {
            mockPolicy1.Object,
          };
          authSettings.AddPolicy("Policy1", mockPolicy1.Object);

          // When
          var policies = authSettings.GetPolicies(new string[] {
            "Policy1",
            "DoesNotExist"
          });

          // Then
          Assert.Equal(mockPolicies, policies);
        }
    }
}