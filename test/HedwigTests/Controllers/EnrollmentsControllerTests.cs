using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hedwig.Controllers;
using Hedwig.Repositories;
using Hedwig.Models;

namespace HedwigTests.Controllers
{
    public class EnrollmentsControllerTests
    {
        [Fact]
        public async Task Get_IncludeEntities_GetsEnrollmentsForSite_WithEntities()
        {
            var _enrollments = new Mock<IEnrollmentRepository>();

            var controller = new EnrollmentsController(_enrollments.Object);

            var siteId = 1;
            var include = new string[]{"foo"};
            await controller.Get(1, siteId, include);

            _enrollments.Verify(e => e.GetEnrollmentsForSiteAsync(siteId, null, null, include), Times.Once());
        }

        [Fact]
        public async Task Get_Id_IncludeEntities_GetsEnrollmentsForSite_WithEntities()
        {
           var _enrollments = new Mock<IEnrollmentRepository>();

           var controller = new EnrollmentsController(_enrollments.Object);

           var id = 1;
           var siteId = 1;
           var include = new string[]{"foo"};
           await controller.Get(id, 1, siteId, include);

           _enrollments.Verify(e => e.GetEnrollmentForSiteAsync(id, siteId, include), Times.Once()); 
        }

        [Theory]
        [InlineData(0, 0, true, typeof(CreatedAtActionResult))]
        [InlineData(1, 0, false, typeof(BadRequestResult))]
        [InlineData(0, 1, false, typeof(BadRequestResult))]
        public async Task Post_AddsEnrollment_IfValid(
            int id,
            int siteId,
            bool shouldAddEnrollment,
            Type resultType
        )
        {
            var _enrollments = new Mock<IEnrollmentRepository>();

            var controller = new EnrollmentsController(_enrollments.Object);

            var enrollment = new Enrollment{
                Id = id,
                SiteId = siteId
            };

            var organizationId = 1;
            var result = await controller.Post(organizationId, siteId, enrollment);
            var times = shouldAddEnrollment ? Times.Once() : Times.Never();
            _enrollments.Verify(e => e.AddEnrollment(It.IsAny<Enrollment>()), times);

            Assert.IsType(resultType, result.Result);
        }


        [Theory]
        [InlineData(1, 1, 1, 1, false, true, typeof(NoContentResult))]
        [InlineData(1, 2, 1, 1, false, false, typeof(BadRequestResult))]
        [InlineData(1, 1, 1, 2, false, false, typeof(BadRequestResult))]
        [InlineData(1, 1, 1, 1, true, true, typeof(NotFoundResult))]
        public async Task Put_UpdatesEnrollment_IfValid_AndExists(
            int pathId,
            int id,
            int pathSiteId,
            int siteId,
            bool shouldNotFind,
            bool shouldUpdateEnrollment,
            Type resultType
        )
        {
            var _enrollments = new Mock<IEnrollmentRepository>();
            if(shouldNotFind) {
                _enrollments.Setup(e => e.SaveChangesAsync())
                    .Throws(new DbUpdateConcurrencyException());
            }

            var controller = new EnrollmentsController(_enrollments.Object);

            var enrollment = new Enrollment{
                Id = id,
                SiteId = siteId
            };

            var result = await controller.Put(pathId, 1, pathSiteId, enrollment);
            var times = shouldUpdateEnrollment ? Times.Once() : Times.Never();
            _enrollments.Verify(e => e.UpdateEnrollment(It.IsAny<Enrollment>()), times);
            Assert.IsType(resultType, result.Result);
        }
    }
}