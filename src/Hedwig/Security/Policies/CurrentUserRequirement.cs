using System;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Language.AST;
using Hedwig.Data;

namespace Hedwig.Security
{
    public class CurrentUserRequirement : IAuthorizationRequirement
    {
        public Task Authorize(AuthorizationContext context)
        {
            var queryId = context.Arguments.ValueFor("id")?.Value;
            var authenticatedId = context.User.FindFirst("sub")?.Value;
            if (queryId == null || authenticatedId == null)
            {
                return Task.CompletedTask;
            }

            if (!queryId.Equals(Int32.Parse(authenticatedId)))
            {
                context.ReportError("The current user is required.");
            }

            return Task.CompletedTask;
        }
    }
}