using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Hedwig.Controllers
{
  [ApiController]
  [Route("api/status")]
  public class StatusController : ControllerBase
  {
    private readonly IConfiguration _configuration;

    public StatusController(
      IConfiguration configuration
    )
    {
      _configuration = configuration;
    }
    
    [HttpGet]
    public IActionResult GetAction()
    {
      var env = _configuration.GetValue<string>("EnvironmentName");
      return Ok(new {
        Environment = env
      });
    }

  }
}