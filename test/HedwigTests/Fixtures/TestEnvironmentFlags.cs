using System;

namespace HedwigTests.Fixtures
{
  public class TestEnvironmentFlags
  {
	public const string SQL_LOGGING = "SQL_LOGGING";
	public const string HTTP_LOGGING = "HTTP_LOGGING";
	public const string RETAIN_OBJECTS = "RETAIN_OBJECTS";

	public static Boolean ShouldLogSQL()
	{
	  return Environment.GetEnvironmentVariable(SQL_LOGGING) != null;
	}

	public static Boolean ShouldLogHTTP()
	{
	  return Environment.GetEnvironmentVariable(HTTP_LOGGING) != null;
	}
  }
}
