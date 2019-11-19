using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Repositories;
using Hedwig.Models;

namespace Hedwig.Controllers
{
    [Route("api/organizations/{orgId:int}/[controller]")]
    [ApiController]
    public class SitesController : ControllerBase
    {
        private readonly ISiteRepository _sites;

        public SitesController(ISiteRepository sites)
        {
            _sites = sites;
        }

        // GET api/organizations/5/sites
        [HttpGet]
        public async Task<ActionResult<List<Site>>> Get(int orgId)
        {
            var sites = await _sites.GetSitesByOrganizationIdsAsync(new int[] { orgId });
            return sites.SelectMany(group => group).ToList();
        }

        // GET api/organizations/5/sites/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Site>> Get(int orgId, int id)
        {
            return await _sites.GetSiteByIdAsync(id);
        }
    }
}
