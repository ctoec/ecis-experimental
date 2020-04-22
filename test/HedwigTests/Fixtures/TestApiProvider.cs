using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace HedwigTests.Fixtures
{
	public class TestApiProvider : WebApplicationFactory<TestStartup>
	{
		protected override IWebHostBuilder CreateWebHostBuilder()
		{
			return new WebHostBuilder()
				.UseConfiguration(
					new ConfigurationBuilder()
						.AddEnvironmentVariables()
						.Build()
					)
				.UseEnvironment(Environments.Development)
				.UseStartup<TestStartup>()
				.UseTestServer();
		}
	}
}
