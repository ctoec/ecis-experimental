using System;
using System.Net.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace HedwigTests.Fixtures
{
	public class TestApiProvider : IDisposable
	{
		private TestServer _server;
		public TestHedwigContext Context;
		public HttpClient Client { get; private set; }
		public TestApiProvider()
		{
			var config = new ConfigurationBuilder()
				.AddEnvironmentVariables()
				.Build();
				
			_server = new TestServer(
				new WebHostBuilder()
					.UseConfiguration(config)
					.UseStartup<TestStartup>()
			);
			var scope = _server.Host.Services.CreateScope();
			Context = scope.ServiceProvider.GetRequiredService<TestHedwigContext>();
			Client = _server.CreateClient();
		}

		public void Dispose()
		{
			Context?.Dispose();
			_server?.Dispose();
			Client?.Dispose();
		}
	}	
}
