using System;
using System.Net.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Hedwig.Data;
using Hedwig;

namespace HedwigTests
{
	public class TestClientProvider : IDisposable
	{
		public delegate void SeedFunc(HedwigContext context);
		private TestServer _server;
		public HttpClient Client { get; private set; }
		public TestClientProvider(SeedFunc seedData = null)
		{
			var config = new ConfigurationBuilder()
				.AddEnvironmentVariables()
				.Build();
				
			_server = new TestServer(
				new WebHostBuilder()
					.UseConfiguration(config)
					.UseStartup<Startup>()
			);
			using (var scope = _server.Host.Services.CreateScope()) {
				var context = scope.ServiceProvider.GetRequiredService<HedwigContext>();
				context.Database.EnsureCreated();
				if(seedData != null) {
					seedData(context);
				}
			}
			Client = _server.CreateClient();
		}

		public void Dispose()
		{
			_server?.Dispose();
			Client?.Dispose();
		}
	}	
}
