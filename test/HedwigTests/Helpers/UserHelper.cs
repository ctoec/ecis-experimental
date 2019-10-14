using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class UserHelper
	{
		public const string FIRST_NAME = "Test";
		public const string LAST_NAME = "User";

		public static User CreateUser(
			HedwigContext context,
			string firstName = "Test",
			string lastName = "User"
		)
		{
			var user = new User
			{
				FirstName = firstName,
				LastName = lastName
			};

			context.Users.Add(user);
			context.SaveChanges();
			return user;
		}
	}
}
