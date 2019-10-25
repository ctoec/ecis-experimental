using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Security;
using HedwigTests.Helpers;
using System;

namespace HedwigTests.Security
{
    public class AuthorizationEvaluatorTests
    {
        private readonly AuthorizationEvaluator _evaluator;
        private readonly AuthorizationSettings _settings;

        public AuthorizationEvaluatorTests()
        {
            _settings = new AuthorizationSettings();
            _evaluator = new AuthorizationEvaluator(_settings);
        }

        [Fact]
        public async Task Succedes_When_No_Policies()
        {
          // If
          var rules = new AuthorizationRules();

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Succedes_When_No_Rules()
        {
          // If
          _settings.AddPolicy("AlwaysFalse", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement()));
          var rules = new AuthorizationRules();

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }
        
        [Fact]
        public async Task Succeedes_When_Allow_Rule_Succeedes()
        {
          // If
          _settings.AddPolicy("AlwaysTrue", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement()));
          var rules = new AuthorizationRules();
          rules.Allow("AlwaysTrue");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Fails_When_Deny_Rule_Succeedes()
        {
          // If
          _settings.AddPolicy("AlwaysTrue", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement()));
          var rules = new AuthorizationRules();
          rules.Deny("AlwaysTrue");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.False(result.Succeeded);
        }

        [Fact]
        public async Task Continues_When_AllowNot_Rule_Succeedes()
        {
          // If
          _settings.AddPolicy("AlwaysTrue", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement()));
          _settings.AddPolicy("Exception", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetThrowsExceptionRequirement()));
          var rules = new AuthorizationRules();
          rules.AllowNot("AlwaysTrue");
          // Rule action irrelevant
          rules.Allow("Exception");

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });

          // Then
          Assert.Equal(AuthorizationRequirementHelper.RequirementException, ex.Message);
        }

        [Fact]
        public async Task Continues_When_DenyNot_Rule_Succeedes()
        {
          // If
          _settings.AddPolicy("AlwaysTrue", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement()));
          _settings.AddPolicy("Exception", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetThrowsExceptionRequirement()));
          var rules = new AuthorizationRules();
          rules.DenyNot("AlwaysTrue");
          // Rule action irrelevant
          rules.Allow("Exception");

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            var result = await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });

          // Then
          Assert.Equal(AuthorizationRequirementHelper.RequirementException, ex.Message);
        }

        [Fact]
        public async Task Continues_When_Allow_Rule_Fails()
        {
          // If
          _settings.AddPolicy("AlwaysFalse", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement()));
          _settings.AddPolicy("Exception", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetThrowsExceptionRequirement()));
          var rules = new AuthorizationRules();
          rules.Allow("AlwaysFalse");
          // Rule action irrelevant
          rules.Allow("Exception");

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            var result = await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });

          // Then
          Assert.Equal(AuthorizationRequirementHelper.RequirementException, ex.Message);
        }

        [Fact]
        public async Task Continues_When_Deny_Rule_Fails()
        {
          // If
          _settings.AddPolicy("AlwaysFalse", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement()));
          _settings.AddPolicy("Exception", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetThrowsExceptionRequirement()));
          var rules = new AuthorizationRules();
          rules.Deny("AlwaysFalse");
          // Rule action irrelevant
          rules.Allow("Exception");

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });

          // Then
          Assert.Equal(AuthorizationRequirementHelper.RequirementException, ex.Message);
        }

        [Fact]
        public async Task Succeedes_When_AllowNot_Rule_Fails()
        {
          // If
          _settings.AddPolicy("AlwaysFalse", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement()));
          var rules = new AuthorizationRules();
          rules.AllowNot("AlwaysFalse");

          // When 
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Fails_When_DenyNot_Rule_Fails()
        {
          // If
          _settings.AddPolicy("AlwaysFalse", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement()));
          var rules = new AuthorizationRules();
          rules.DenyNot("AlwaysFalse");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.False(result.Succeeded);
        }

        [Fact]
        public async Task Succedes_When_Allow_Policy_Has_No_Requirement()
        {
          // If
          _settings.AddPolicy("NoRequirement", _ => {});
          var rules = new AuthorizationRules();
          rules.Allow("NoRequirement");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Fails_When_Deny_Policy_Has_No_Requirement()
        {
          // If
          _settings.AddPolicy("NoRequirement", _ => {});
          var rules = new AuthorizationRules();
          rules.Deny("NoRequirement");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.False(result.Succeeded);
        }

        [Fact]
        public async Task Continues_When_AllowNot_Policy_Has_No_Requirement()
        {
          // If
          _settings.AddPolicy("NoRequirement", _ => {});
          _settings.AddPolicy("Exception", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetThrowsExceptionRequirement()));
          var rules = new AuthorizationRules();
          rules.AllowNot("NoRequirement");
          // Rule action irrelevant
          rules.Allow("Exception");

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });

          // Then
          Assert.Equal(AuthorizationRequirementHelper.RequirementException, ex.Message);
        }

        [Fact]
        public async Task Continues_When_DenyNot_Policy_Has_No_Requirement()
        {
          // If
          _settings.AddPolicy("NoRequirement", _ => {});
          _settings.AddPolicy("Exception", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetThrowsExceptionRequirement()));
          var rules = new AuthorizationRules();
          rules.DenyNot("NoRequirement");
          // Rule action irrelevant
          rules.Allow("Exception");

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });

          // Then
          Assert.Equal(AuthorizationRequirementHelper.RequirementException, ex.Message);
        }

        [Fact]
        public async Task Succeedes_When_Allow_CatchAll()
        {
          // If
          var rules = new AuthorizationRules();
          rules.Allow();

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Fails_When_Deny_CatchAll()
        {
          // If
          var rules = new AuthorizationRules();
          rules.Deny();

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.False(result.Succeeded);
        }

        [Fact]
        public async Task Throws_When_AllowNot_CatchAll()
        {
          // If
          var message = "Final rule must be Allow or Deny";
          var rules = new AuthorizationRules();
          rules.AllowNot();

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });
          
          // Then
          Assert.Equal(message, ex.Message);
        }

        [Fact]
        public async Task Throws_When_DenyNot_CatchAll()
        {
          // If
          var message = "Final rule must be Allow or Deny";
          var rules = new AuthorizationRules();
          rules.DenyNot();

          // When
          Exception ex = await Assert.ThrowsAsync<Exception>(async () => {
            await _evaluator.Evaluate(
              null, // principal
              null, // user context
              null, // input variables
              rules,
              null // query arguments
            );
          });
          
          // Then
          Assert.Equal(message, ex.Message);
        }
        
        [Fact]
        public async Task Succeeds_When_Allow_Rule_Two_Requirements_Succeed()
        {
          // If
          _settings.AddPolicy("TwoAlwaysTrue", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement())
             .AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement())
          );
          var rules = new AuthorizationRules();
          rules.Allow("TwoAlwaysTrue");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Succeedes_When_AllowNot_Rule_Two_Requirements_Fail()
        {
          // If
          _settings.AddPolicy("TwoAlwaysFalse", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement())
             .AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement())
          );
          var rules = new AuthorizationRules();
          rules.AllowNot("TwoAlwaysFalse");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Succeedes_When_AllowNot_Rule_Requirements_One_Success_One_Fail()
        {
          // If
          _settings.AddPolicy("OneAlwaysTrueOneAlwaysFalse", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement())
             .AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement())
          );
          var rules = new AuthorizationRules();
          rules.AllowNot("OneAlwaysTrueOneAlwaysFalse");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }

        [Fact]
        public async Task Succeedes_When_AllowNot_Rule_Requirements_One_Fail_One_Success()
        {
          // If
          _settings.AddPolicy("OneAlwaysFalseOneAlwaysTrue", _ =>
            _.AddRequirement(AuthorizationRequirementHelper.GetAlwaysFalseRequirement())
             .AddRequirement(AuthorizationRequirementHelper.GetAlwaysTrueRequirement())
          );
          var rules = new AuthorizationRules();
          rules.AllowNot("OneAlwaysFalseOneAlwaysTrue");

          // When
          var result = await _evaluator.Evaluate(
            null, // principal
            null, // user context
            null, // input variables
            rules,
            null // query arguments
          );

          // Then
          Assert.True(result.Succeeded);
        }
    }
}
