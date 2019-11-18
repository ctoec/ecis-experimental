using Microsoft.AspNetCore.Mvc;
using System.Linq;
namespace Hedwig.Controllers
{
    public class HedwigController : ControllerBase
    {
        public const string  INCLUDE_FAMILY = "family";
        public  const string INCLUDE_DETERMINATIONS  = "determinations";
    }
}