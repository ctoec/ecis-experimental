using System;
using System.Net.Http;
using Hedwig.Models;
using Microsoft.AspNetCore.WebUtilities;

namespace HedwigTests.Integrations
{
	public static class HedwigAPIRequests
	{
		public static HttpRequestMessage OrganizationEnrollmentsSummary(
			User user,
			Organization organization,
			Site[] sites,
			string[] include = null,
			DateTime? startDate = null,
			DateTime? endDate = null
		)
		{
			include = include ?? new string[] {
				"child",
				"fundings",
				"sites"
			};

			var uri = $"api/organizations/{organization.Id}/Enrollments";

			foreach (var item in include)
			{
				uri = QueryHelpers.AddQueryString(uri, "include[]", item);
			}

			foreach (var item in sites)
			{
				uri = QueryHelpers.AddQueryString(uri, "siteIds[]", item.Id.ToString());
			}

			return MakeAuthenticatedRequest(HttpMethod.Get, user, uri);
		}

		public static HttpRequestMessage MakeAuthenticatedRequest(HttpMethod method, User user, string url)
		{
			var request = new HttpRequestMessage(method, url);
			request.Headers.Add("claims_sub", $"{user.WingedKeysId}");
			return request;
		}
	}
}
