using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Repositories;
using Hedwig.Models;

namespace Hedwig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationsController : ControllerBase
    {
        private readonly IOrganizationRepository _organizations;

        public OrganizationsController(IOrganizationRepository organizations)
        {
            _organizations = organizations;
        }

        // GET api/organizations
        [HttpGet]
        public ActionResult<string> Get()
        {
            return "hello org";
        }

        // GET api/organizations/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "hello org";
        }
    }
}
