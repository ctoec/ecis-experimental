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
    [Route("api/organizations/{orgId:int}/[controller]")]
    [ApiController]
    public class SitesController : ControllerBase
    {
        private readonly ISiteRepository _sites;
        private readonly IEnrollmentRepository _enrollments;
        private readonly IChildRepository _children;
        private readonly IFamilyRepository _families;

        public SitesController(
            ISiteRepository sites,
            IEnrollmentRepository enrollments,
            IChildRepository children,
            IFamilyRepository families
        )
        {
            _sites = sites;
            _enrollments = enrollments;
            _children = children;
            _families = families;
        }

        // GET api/organizations/5/sites
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<List<Site>>> Get(int orgId)
        {
            return await _sites.GetSitesForOrganizationAsync(orgId);
        }

        // GET api/organizations/5/sites/1
        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Site>> Get(
            int id,
            int orgId,
            [FromQuery(Name = "include[]")] string[] include
        )
        {
            var site = await _sites.GetSiteForOrganizationAsync(id, orgId, include);
            if (site == null) return NotFound();
            return site;
        }
    }
}