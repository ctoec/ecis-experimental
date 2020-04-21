using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Moq;
using Xunit;
using Hedwig.Controllers;
using Hedwig.Repositories;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Net.Http.Headers;

namespace HedwigTests.Controllers
{
	public class EnrollmentsControllerIntegrationTests : IClassFixture<TestApiProvider>
	{
		private readonly TestApiProvider _factory;

		public EnrollmentsControllerIntegrationTests(
			TestApiProvider factory
		)
		{
			_factory = factory;
		}

		[Fact]
		public async Task EnrollmentControllerGet_ReturnsCorrectResponseShape()
		{
			User user;
			Enrollment enrollment;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var site = SiteHelper.CreateSite(context);
				enrollment = EnrollmentHelper.CreateEnrollment(context, site: site);
				user = UserHelper.CreateUser(context);
				PermissionHelper.CreateSitePermission(context, user, site);
			}

			var client = _factory
				.WithWebHostBuilder(builder => builder.UseContentRoot("."))
				.CreateClient();

			var request = new HttpRequestMessage(HttpMethod.Get,
				$"api/organizations/{enrollment.Site.OrganizationId}/sites/{enrollment.Site.Id}/Enrollments"
			);
			// var request = new HttpRequestMessage(HttpMethod.Get,
			// 	$"test"
			// );
			request.Headers.Add("claims_sub", $"{user.WingedKeysId}");

			var response = await client.SendAsync(request);
			// var response = await client.GetAsync($"api/organizations/2664/sites/1700/Enrollments?include[]=child&include[]=fundings&include[]=sites&startDate=2020-04-20T20:47:29.859Z&endDate=2020-04-20T20:47:29.859Z&skip=0&take=50");
			
			var responseString = await response.Content.ReadAsStringAsync();
			// try
			// {
				var responseEnrollments = JsonConvert.DeserializeObject<List<Enrollment>>(responseString);
				Assert.NotEmpty(responseEnrollments);

				var responseEnrollment = responseEnrollments.First();

				Assert.Equal(enrollment.Id, responseEnrollment.Id);
			// }
			// catch (Exception e)
			// {
			// 	Console.WriteLine(e);
			// 	Assert.True(false);
			// }
		}
	}
}