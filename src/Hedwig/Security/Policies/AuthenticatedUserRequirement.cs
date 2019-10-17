/**
 * Using code from https://github.com/graphql-dotnet/authorization/blob/8e7b3c70577c15ee45d16080eeba8273315b4e9c/src/GraphQL.Authorization/AuthenticatedUserRequirement.cs
 * This class is released in v3 of GraphQL.Authorization which we currently don't use.
 */
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Authorization;

namespace Hedwig.Security
{
    public class AuthenticatedUserRequirement : IAuthorizationRequirement
    {
        public Task Authorize(AuthorizationContext context)
        {
            if (!context.User.Identities.Any(x => x.IsAuthenticated))
            {
                context.ReportError("An authenticated user is required.");
            }

            return Task.CompletedTask;
        }
    }
}