using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class AuthorizationRequirementHelper
	{
		public static ClaimsPrincipal CreatePrincipal(string authenticationType = null, IDictionary<string, string> claims = null)
		{
			var identity = CreateIdentity(authenticationType, claims);
			return new ClaimsPrincipal(identity);
		}

		public static ClaimsIdentity CreateIdentity(string authenticationType, IDictionary<string, string> claims = null)
		{
			var claimsList = new List<Claim>();

			if (claims != null)
			{
				foreach (var c in claims)
				{
					claimsList.Add(new Claim(c.Key, c.Value));
				}
			}

			return new ClaimsIdentity(claimsList, authenticationType);
		}

		public static ClaimsIdentity GetTestIdentity()
		{
			return new ClaimsIdentity(
				new Claim[] {
					new Claim("test_mode", "true")
				},
				"Test Auth"
			);
		}
	}
}
