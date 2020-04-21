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

// using System;
// using System.Net.Http;
// using Microsoft.AspNetCore.TestHost;
// using Microsoft.AspNetCore.Hosting;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Hosting;
// using Hedwig.Data;
// using Microsoft.AspNetCore.Hosting;
// using Microsoft.AspNetCore.Hosting.Server;
// using Microsoft.AspNetCore.Hosting.Server.Features;
// using Hedwig;

// namespace HedwigTests.Fixtures
// {
// 	public class TestApiProvider : IDisposable
// 	{
// 		public IWebHostBuilder Builder { get; private set; }
// 		public TestApiProvider()
// 		{
// 			var config = new ConfigurationBuilder()
// 				.AddEnvironmentVariables()
// 				.Build();

// 			var builder = new WebHostBuilder()
// 				.UseConfiguration(config)
// 				.UseTestServer()
// 				.UseEnvironment(Environments.Development)
// 				.UseStartup<TestStartup>();

// 			var host = builder.Build();
// 			host.StartAsync();
// 			host.GetTestServer();
// 			// _server = new TestServer(builder);

// 			// var scope = _server.Host.Services.CreateScope();
// 			// Context = scope.ServiceProvider.GetRequiredService<HedwigContext>();
// 			// Client = _server.CreateClient();
// 		}

// 		public void Dispose()
// 		{
// 			Context?.Dispose();
// 			_server?.Dispose();
// 			Client?.Dispose();
// 		}
// 	}
// }

