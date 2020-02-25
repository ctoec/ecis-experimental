using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Hedwig.Security
{
	public abstract class HedwigAuthorizationPolicyProvider : IAuthorizationPolicyProvider
	{
		private readonly List<IAuthorizationRequirement> _requirements = new List<IAuthorizationRequirement>();

		protected void AddRequirement(IAuthorizationRequirement requirement)
		{
			_requirements.Add(requirement);
		}

		protected void AddRequirements(List<IAuthorizationRequirement> requirements)
		{
			_requirements.AddRange(requirements);
		}

		virtual public AuthorizationPolicy GetDefaultPolicy()
		{
			return new AuthorizationPolicy(
				_requirements,
				new List<string> { }
			);
		}
		virtual public AuthorizationPolicy GetFallbackPolicy()
		{
			return GetDefaultPolicy();
		}
		virtual public AuthorizationPolicy GetPolicy(string policyName)
		{
			return GetDefaultPolicy();
		}
		virtual public Task<AuthorizationPolicy> GetDefaultPolicyAsync()
		{
			return Task.FromResult(GetDefaultPolicy());
		}
		virtual public Task<AuthorizationPolicy> GetFallbackPolicyAsync()
		{
			return Task.FromResult(GetDefaultPolicy());
		}
		virtual public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
		{
			return Task.FromResult(GetDefaultPolicy());
		}
	}
}
