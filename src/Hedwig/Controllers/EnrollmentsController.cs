using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;
using System;

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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<List<Enrollment>>> Get(
            int orgId,
            int siteId,
            [FromQuery(Name="include")] string[] include
        )
        {

            return await _enrollments.GetEnrollmentsForSiteAsync(siteId, include);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Enrollment>> Get(
            int id,
            int orgId,
            int siteId,
            [FromQuery(Name="include")] string [] include
        )
        {

            var enrollment = await _enrollments.GetEnrollmentForSiteAsync(id, siteId, include);
            if(enrollment == null) return NotFound();

            return enrollment;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Enrollment>> Post(
            int orgId,
            int siteId,
            Enrollment enrollment
        )
        {
            Console.WriteLine("testing");
            Console.WriteLine(enrollment);
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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

            return enrollment;
        }
    }
}