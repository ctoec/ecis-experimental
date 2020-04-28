using System.IO;
using Microsoft.Extensions.Configuration;

namespace Hedwig.Configuration
{
	public static class EnvironmentConfiguration
	{
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
				.GetValue<string>(name, defaultValue ?? "Development");
		}
	}
}
