using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Security_NEW;

namespace Hedwig.Controllers
{
    [Route("api/organizations/{orgId:int}/[controller]")]
    [ApiController]
    [Authorize(Policy = UserOrganizationAccessRequirement.NAME)]
    public class ChildrenController : ControllerBase
    {
        private readonly IChildRepository _children;

        public ChildrenController(IChildRepository children)
        {
            _children = children;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<List<Child>>> Get(
            int orgId,
            [FromQuery(Name="include[]")] string[] include
        ) 
        {

            return await _children.GetChildrenForOrganizationAsync(orgId, include);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Child>> Get(
            Guid id,
            int orgId,
            [FromQuery(Name="include[]")] string[] include
        )
        {

            var child = await _children.GetChildForOrganizationAsync(id, orgId, include);
            if(child == null) return NotFound();
            return child;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
 
        public async Task<ActionResult<Child>> Post(int orgId, Child child)
        {
            // Creating child with Id not allowed (new Guid() is default Guid value)
            if(child.Id != new Guid()) return BadRequest();

            // Creating child with orgId not allowed 
            if(child.OrganizationId.HasValue && child.OrganizationId.Value != 0) return BadRequest();
            
            child.OrganizationId = orgId;

            _children.AddChild(child);
            await _children.SaveChangesAsync();

            return CreatedAtAction(
                nameof(Get),
                new {id = child.Id, orgId = orgId },
                child
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Child>> Put(Guid id, int orgId, Child child)
        {
            if (child.Id != id) return BadRequest();
            if (child.OrganizationId.HasValue && child.OrganizationId.Value != orgId) return BadRequest();


            // TODO: validate that new orgId = existing orgId (may require DTO)
            try {
                _children.UpdateChild(child);
                await _children.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                return NotFound();
            }

            return NoContent();
        }
    }
}