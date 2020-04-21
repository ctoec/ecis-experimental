using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hedwig.Repositories;
using Hedwig.Security;

namespace Hedwig.Controllers
{
	[ApiController]
	[Route("test")]
	public class TestConroller : ControllerBase
	{
		public TestConroller() { }

		[HttpGet]
		public ActionResult<object> Get()
		{
			return new
			{
				Id = 1
			};
		}
	}
}
