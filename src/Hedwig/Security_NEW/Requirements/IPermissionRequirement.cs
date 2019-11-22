using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Hedwig.Repositories;

namespace Hedwig.Security_NEW
{
    public interface IPermissionRequirement : IAuthorizationRequirement
    {
        bool Evaluate(
            ClaimsPrincipal User,
            HttpContext httpContext,
            IPermissionRepository permissions
        );
    }
}