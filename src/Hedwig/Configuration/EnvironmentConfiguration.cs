using System.IO;
using Microsoft.Extensions.Configuration;

namespace Hedwig.Configuration
{
	public static class EnvironmentConfiguration
	{
		private const string DEVELOPMENT = "Development";
		private const string PRODUCTION = "Production";
		public static IConfigurationRoot GetIConfigurationRoot()
		{
			return new ConfigurationBuilder()
				.SetBasePath(Directory.GetCurrentDirectory())
				.AddJsonFile("appsettings.json", optional: true)
				.AddEnvironmentVariables()
				.Build();
		}

		public static string GetEnvironmentVariableFromAppSettings(string name, string defaultValue = null)
		{
			return GetIConfigurationRoot()
				.GetValue<string>(name, defaultValue ?? DEVELOPMENT);
		}

		public static bool IsDevelopment()
		{
			return GetEnvironmentVariableFromAppSettings("EnvironmentName") == DEVELOPMENT;
		}

		public static bool IsProduction()
		{
			return GetEnvironmentVariableFromAppSettings("EnvironmentName") == PRODUCTION;
		}
	}
}
