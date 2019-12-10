using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Hedwig.Repositories;
using Hedwig.Models;

namespace Hedwig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationsController : ControllerBase
    {
        private readonly IOrganizationRepository _organizations;
        private readonly ISiteRepository _sites;
        private readonly IEnrollmentRepository _enrollments;

        public OrganizationsController(
            IOrganizationRepository organizations,
            ISiteRepository sites,
            IEnrollmentRepository enrollments)
        {
            _organizations = organizations;
            _sites = sites;
            _enrollments = enrollments;
        }

        // GET api/organizations
        [HttpGet]
        public ActionResult<string> Get()
        {
            return "hello org";
        }

        // GET api/organizations/5
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Organization>> Get(int id, [FromQuery(Name ="include[]")] string[] include)
        {
            var organization = await _organizations.GetOrganizationByIdAsync(id);

            if (organization == null)
            {
                return NotFound();
            }

            if (include.Contains("site"))
            {
                var sites = await _sites.GetSitesByOrganizationIdsAsync_OLD(new int[] { id });
                if (include.Contains("enrollment"))
                {
                    await _enrollments.GetEnrollmentsBySiteIdsAsync(from site in sites select site.Key);
                }
            }
            return organization;
        }
    }
}
