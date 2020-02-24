using System;
using System.Net.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Hedwig.Data;

namespace HedwigTests.Fixtures
{
  public class TestApiProvider : IDisposable
  {
	private TestServer _server;
	public HedwigContext Context;
	public HttpClient Client { get; private set; }
	public TestApiProvider()
	{
	  var config = new ConfigurationBuilder()
		  .AddEnvironmentVariables()
		  .Build();

	  var builder = new WebHostBuilder()
		  .UseConfiguration(config)
		  .UseStartup<TestStartup>();

	  _server = new TestServer(builder);

	  var scope = _server.Host.Services.CreateScope();
	  Context = scope.ServiceProvider.GetRequiredService<HedwigContext>();
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
