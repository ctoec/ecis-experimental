using System;
using System.Net.Http;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using Hedwig.Models;

namespace HedwigTests.Integrations
{
	public static class HedwigAPIRequests
	{
		public static HttpRequestMessage OrganizationEnrollmentsSummary(
			User user,
			Organization organization,
			Site[] sites,
			DateTime? startDate = null,
			DateTime? endDate = null
		)
		{
			var uri = $"api/organizations/{organization.Id}/Enrollments";

			uri = AddQueryParams(uri, "siteIds[]", s => s.Id.ToString(), sites);

			return MakeAuthenticatedRequest(HttpMethod.Get, user, uri);
		}

		public static HttpRequestMessage OrganizationSiteEnrollmentDetail(
			User user,
			Enrollment enrollment,
			Organization organization,
			Site site,
			DateTime? startDate = null,
			DateTime? endDate = null
		)
		{
			var uri = $"api/organizations/{organization.Id}/sites/{site.Id}/Enrollments/{enrollment.Id}";

			return MakeAuthenticatedRequest(HttpMethod.Get, user, uri);
		}

		public static HttpRequestMessage Organizations(
			User user,
			Organization organization
		)
		{
			var uri = $"api/organizations/{organization.Id}";

			return MakeAuthenticatedRequest(HttpMethod.Get, user, uri);
		}

		public static HttpRequestMessage OrganizationReports(
			User user,
			Organization organization
		)
		{
			var uri = $"api/organizations/{organization.Id}/Reports";
			return MakeAuthenticatedRequest(HttpMethod.Get, user, uri);
		}

		public static HttpRequestMessage OrganizationReport(
			User user,
			Organization organization,
			Report report
		)
		{
			var uri = $"api/organizations/{organization.Id}/Reports/{report.Id}";

			return MakeAuthenticatedRequest(HttpMethod.Get, user, uri);
		}

		public static HttpRequestMessage OrganizationReportPut(
			User user,
			Organization organization,
			Report report
		)
		{
			var uri = $"api/organizations/{organization.Id}/Reports/{report.Id}";
			var request = MakeAuthenticatedRequest(HttpMethod.Put, user, uri);
			return AddBodyParams(request, report);
		}

		public static HttpRequestMessage EnrollmentPost(
			User user,
			Enrollment enrollment,
			Organization organization,
			Site site
		)
		{
			var uri = $"api/organizations/{organization.Id}/sites/{site.Id}/Enrollments";

			var request = MakeAuthenticatedRequest(HttpMethod.Post, user, uri);

			return AddBodyParams(request, enrollment);
		}

		public static HttpRequestMessage MakeAuthenticatedRequest(HttpMethod method, User user, string url)
		{
			var request = new HttpRequestMessage(method, url);
			request.Headers.Add("claims_sub", $"{user.WingedKeysId}");
			return request;
		}

		public static string AddQueryParams<T>(string uri, string key, Func<T, string> action, T[] values)
		{
			foreach (var item in values)
			{
				uri = QueryHelpers.AddQueryString(uri, key, action(item));
			}
			return uri;
		}

		public static HttpRequestMessage AddBodyParams<T>(HttpRequestMessage request, T body)
		{
			var paramBody = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");

			request.Content = paramBody;

			return request;
		}
	}
}
