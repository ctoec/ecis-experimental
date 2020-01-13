using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Repositories;

namespace Hedwig.Security
{
    public class RequirementsHandler : IAuthorizationHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPermissionRepository _permissions;

        public RequirementsHandler(IHttpContextAccessor httpContextAccessor, IPermissionRepository permissions)
        {
            _httpContextAccessor = httpContextAccessor;
            _permissions = permissions;
        }
        public Task HandleAsync(AuthorizationHandlerContext context)
        {
            var pendingRequirements = context.PendingRequirements.ToList();

            foreach (var req in pendingRequirements) {
                if (req is IPermissionRequirement pReq)
                    if(pReq.Evaluate(
                        context.User,
                        _httpContextAccessor.HttpContext,
                        _permissions
                        )
                    ) context.Succeed(req);
                }

            return Task.CompletedTask;
        }
    }
}
