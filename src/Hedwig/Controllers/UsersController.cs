using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Repositories;
using Hedwig.Models;
using System.Security.Claims;

namespace Hedwig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _users;

        public UsersController(IUserRepository users)
        {
            _users = users;
        }

        // GET api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            return await _users.GetUserByIdAsync(id);
        }

        // GET api/users/current
        [HttpGet("current")]
        public async Task<ActionResult<User>> GetCurrent()
        {
            var userIdStr = User.FindFirst("sub")?.Value;
            if (userIdStr == null) { return null; }
            var userId = Int32.Parse(userIdStr);
            return await _users.GetUserByIdAsync(userId);
        }

        // Examples:
        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
