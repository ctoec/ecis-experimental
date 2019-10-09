using System;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Models;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
    [Collection("SqlServer")]
    public class UserRepositoryTests
    {
        [Fact]
        public async Task Get_User_By_Id()
        {
            using (var context = new TestContextProvider().Context) {
				// If a user exists
				var user = UserHelper.CreateUser(context);

                // When the repository is queried by Id
                var userRepo = new UserRepository(context);
                var res = await userRepo.GetUserByIdAsync(user.Id);

                // Then the user with that Id is returned
                Assert.Equal(user.Id, res.Id);
            }
        }
    }
}
