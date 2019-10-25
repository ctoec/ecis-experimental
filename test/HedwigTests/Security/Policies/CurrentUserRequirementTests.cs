using Xunit;
using System.Collections.Generic;
using Moq;
using Hedwig.Security;
using System.Security.Claims;
using HedwigTests.Helpers;
using Microsoft.AspNetCore.Hosting;
using GraphQL.Language.AST;
using System;

namespace HedwigTests.Security
{
    public class CurrentUserRequirementTests
    {
        [Fact]
        public async void When_Current_User_Authorize_Produces_No_Error()
        {
          // If
          var requirement = new CurrentUserRequirement();
          var context = new AuthorizationContext();
          var claims = new Dictionary<string, string>() {
            { "sub", "1" }
          };
          context.User = AuthorizationRequirementHelper.CreatePrincipal("password", claims);
          var argument = BuildArgument(typeof(IntValue), "id", 1);
          var arguments = new Arguments();
          arguments.Add(argument);
          context.Arguments = arguments;

          // When
          await requirement.Authorize(context);

          // Then
          Assert.False(context.HasErrors);
        }

        [Fact]
        public async void When_Not_Current_User_Authorize_Produces_Error()
        {
          // If
          var requirement = new CurrentUserRequirement();
          var context = new AuthorizationContext();
          var claims = new Dictionary<string, string>() {
            { "sub", "1" }
          };
          context.User = AuthorizationRequirementHelper.CreatePrincipal("password", claims);
          var argument = BuildArgument(typeof(IntValue), "id", 2);
          var arguments = new Arguments();
          arguments.Add(argument);
          context.Arguments = arguments;

          // When
          await requirement.Authorize(context);

          // Then
          Assert.True(context.HasErrors);
        }

        private static Argument BuildArgument(Type t, string name, object value)
        {
          var nameNode = new NameNode(name);
          var argument = new Argument(nameNode);
          var iValue = (IValue) Activator.CreateInstance(t, value);
          argument.Value = iValue;
          return argument;
        }
    }
}