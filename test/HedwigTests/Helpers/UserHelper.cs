using System;
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
		string lastName = "User",
		Guid? wingedKeysId = null
	)
	{
	  Guid _wingedKeysId = wingedKeysId ?? Guid.NewGuid();

	  var user = new User
	  {
		FirstName = firstName,
		LastName = lastName,
		WingedKeysId = _wingedKeysId
	  };

	  context.Users.Add(user);
	  context.SaveChanges();
	  return user;
	}
  }
}
