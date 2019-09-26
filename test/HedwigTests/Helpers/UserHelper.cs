using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class UserHelper
	{
		public const string FIRST_NAME = "Test";
		public const string LAST_NAME = "User";

		public static User CreateUser(HedwigContext context, string firstNameOverride = null)
		{
			var user = new User {
				FirstName = firstNameOverride ?? FIRST_NAME,
				LastName = LAST_NAME 
				};
			context.Users.Add(user);
			context.SaveChanges();
			return user;
		}
	}
}
