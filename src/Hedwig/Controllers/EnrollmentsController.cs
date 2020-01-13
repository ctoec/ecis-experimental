using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Security;
using System;

namespace Hedwig.Controllers
{
    [ApiController]
    [Authorize(Policy = UserSiteAccessRequirement.NAME)]
    [Route("api/organizations/{orgId:int}/sites/{siteId:int}/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly INonBlockingValidator _validator;
        private readonly IEnrollmentRepository _enrollments;
        public EnrollmentsController(
            INonBlockingValidator validator,
            IEnrollmentRepository enrollments
        )
        {
            _validator = validator;
            _enrollments = enrollments;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<List<Enrollment>>> Get(
            int orgId,
            int siteId,
            [FromQuery(Name="include[]")] string[] include,
            [FromQuery(Name="startDate")] DateTime? from = null,
            [FromQuery(Name="endDate")] DateTime? to = null
        )
        {

            var enrollments = await _enrollments.GetEnrollmentsForSiteAsync(siteId, from, to, include);
            _validator.Validate(enrollments);
            return enrollments;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Enrollment>> Get(
            int id,
            int orgId,
            int siteId,
            [FromQuery(Name="include[]")] string [] include
        )
        {

            var enrollment = await _enrollments.GetEnrollmentForSiteAsync(id, siteId, include);
            if(enrollment == null) return NotFound();

            _validator.Validate(enrollment);

            return enrollment;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Enrollment>> Post(
            int orgId,
            int siteId,
            Enrollment enrollment
        )
        {
            // Creating enrollment with Id not allowed
            if (enrollment.Id != 0) return BadRequest();

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
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Enrollment>> Put(
            int id,
            int orgId,
            int siteId,
            Enrollment enrollment
        )
        {
            if (enrollment.Id != id) return BadRequest();

            try {
                _enrollments.UpdateEnrollment(enrollment);
                await _enrollments.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            _validator.Validate(enrollment);
            return Ok(enrollment);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(
            int id,
            int orgId,
            int siteId,
            Enrollment enrollment
        )
        {
            if (enrollment.Id != id) return BadRequest();

            try {
                _enrollments.DeleteEnrollment(enrollment);
                await _enrollments.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
