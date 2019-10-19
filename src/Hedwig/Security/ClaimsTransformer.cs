using System;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Hedwig.Data;

namespace Hedwig.Security {
	public class ClaimsTransformer : IClaimsTransformation
	{
		private readonly HedwigContext _context;

		public ClaimsTransformer(HedwigContext context)
		{
				_context = context;
		}

		public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
      return Task.FromResult(principal);
		}
	}
}