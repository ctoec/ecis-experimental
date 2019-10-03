// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using System.Collections.Generic;
using System.Security.Claims;

namespace OpenIDProvider
{
  public static class Config
  {
	public static List<TestUser> GetUsers()
	{
	  return new List<TestUser>
			{
				new TestUser
				{
					SubjectId = "1",
					Username = "voldemort",
					Password = "thechosenone",

					Claims = new []
					{
						new Claim("name", "Voldemort"),
						new Claim("allowed_apps", "hedwig")
					}
				}
			};
	}

	public static IEnumerable<IdentityResource> GetIdentityResources()
	{
	  return new List<IdentityResource>
			{
				new IdentityResources.OpenId(),
				new IdentityResources.Profile(),
			};
	}

	public static IEnumerable<ApiResource> GetApis()
	{
	  return new List<ApiResource>
			{
			};
	}

	public static IEnumerable<Client> GetClients()
	{
	  return new List<Client>
			{
				// Hedwig Client
        new Client
				{
					ClientId = "hedwig",
					ClientName = "Hedwig Client",
					AllowedGrantTypes = GrantTypes.Code,
					RequireClientSecret = false,

					RedirectUris =           { "https://localhost:5000/login/callback" },
					PostLogoutRedirectUris = { "https://localhost:5000" },
					AllowedCorsOrigins =     { "https://localhost:5000" },

					AllowedScopes =
					{
						IdentityServerConstants.StandardScopes.OpenId,
						IdentityServerConstants.StandardScopes.Profile
					}
				}
			};
	}
  }
}
