using System;
using System.Net.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Hedwig.Data;

namespace HedwigTests
{
	public class TestClientProvider : IDisposable
	{
		public delegate void SeedFunc(HedwigContext context);
		private TestServer _server;
		public HttpClient Client { get; private set; }
		public TestClientProvider(SeedFunc seedData = null)
		{
			_server = new TestServer(
				new WebHostBuilder()
					.UseStartup<TestStartup>()
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
