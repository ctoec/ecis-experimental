using System;
using System.IO;
using System.Net.Http;
using System.Reflection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace HedwigTests.Fixtures
{
	public class TestStartupFactory : WebApplicationFactory<TestStartup>
	{
		private readonly string ContentRoot;
		public TestStartupFactory()
			: this(Path.Join(""))
		{ }

		protected TestStartupFactory(string projectRelativePath)
		{
			var assembly = typeof(TestStartup).GetTypeInfo().Assembly;
			ContentRoot = GetProjectPath(projectRelativePath, assembly);
		}

		protected override void ConfigureWebHost(IWebHostBuilder builder)
		{
			builder
				.UseConfiguration(
					new ConfigurationBuilder()
						.AddEnvironmentVariables()
						.Build()
					)
				.UseEnvironment(Environments.Development)
				.UseContentRoot(ContentRoot)
				.UseStartup<TestStartup>()
				.UseTestServer();
		}

		protected override IWebHostBuilder CreateWebHostBuilder()
		{
			return new WebHostBuilder();
		}

		private static string GetProjectPath(string projectRelativePath, Assembly startupAssembly)
		{
			var projectName = startupAssembly.GetName().Name;
			var applicationBasePath = AppContext.BaseDirectory;
			var directoryInfo = new DirectoryInfo(applicationBasePath);

			do
			{
				directoryInfo = directoryInfo.Parent;
				var projectDirectoryInfo = new DirectoryInfo(Path.Combine(directoryInfo.FullName, projectRelativePath));

				if (projectDirectoryInfo.Exists)
				{
					if (new FileInfo(Path.Combine(projectDirectoryInfo.FullName, projectName, $"{projectName}.csproj")).Exists)
					{
						return Path.Combine(projectDirectoryInfo.FullName, projectName);
					}
				}
			}
			while (directoryInfo.Parent != null);

			throw new Exception($"Project root could not be located using the application root {applicationBasePath}.");
		}
	}
}
