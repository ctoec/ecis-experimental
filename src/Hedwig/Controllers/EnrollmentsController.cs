using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Controllers
{
    [ApiController]
    [Route("api/organizations/{orgId:int}/sites/{siteId:int}/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentRepository _enrollments;
        public EnrollmentsController(
            IEnrollmentRepository enrollments
        )
        {
            _enrollments = enrollments;
        }

        [HttpGet]
        public async Task<ActionResult<List<Enrollment>>> Get(
            int orgId,
            int siteId,
						[FromQuery(Name = "startDate")] DateTime from,
						[FromQuery(Name = "endDate")] DateTime to,
            [FromQuery(Name="include")] string[] include
        )
        {

            return await _enrollments.GetEnrollmentsForSiteAsync(siteId, from, to, include);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Enrollment>> Get(
            int id,
            int orgId,
            int siteId,
            [FromQuery(Name="include")] string [] include
        )
        {

            return await _enrollments.GetEnrollmentForSiteAsync(id, siteId, include);
        }

        [HttpPost]
        public async Task<ActionResult<Enrollment>> Post(
            int orgId,
            int siteId,
            Enrollment enrollment
        )
        {
            // Creating enrollment with Id not allowed 
            if (enrollment.Id != 0) return BadRequest();

            // Creating enrollment with siteId not allowed
            if (enrollment.SiteId != 0) return BadRequest();

            enrollment.SiteId = siteId;

            _enrollments.AddEnrollment(enrollment);
            await _enrollments.SaveChangesAsync();

            return CreatedAtAction(
                nameof(Get),
                new { id = enrollment.Id, orgId = orgId, siteId = siteId },
                enrollment
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Enrollment>> Put(
            int id,
            int orgId,
            int siteId,
            Enrollment enrollment
        )
        {
            if (enrollment.Id != id) return BadRequest();
            if (enrollment.SiteId != siteId) return BadRequest();

            try {
                _enrollments.UpdateEnrollment(enrollment);
                await _enrollments.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}