using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using Hedwig.Controllers;
using Hedwig.Repositories;
using Hedwig.Models;
using AutoMapper;

namespace HedwigTests.Controllers
{
	public class EnrollmentsControllerTests
	{
		[Fact]
		public async Task Get_IncludeEntities_GetsEnrollmentsForSite_WithEntities()
		{
			var _enrollments = new Mock<IEnrollmentRepository>();
			var _sites = new Mock<ISiteRepository>();
			var _mapper = new Mock<IMapper>();

			var controller = new EnrollmentsController(_enrollments.Object, _sites.Object, _mapper.Object);

			var siteId = 1;
			var include = new string[] { "foo" };
			await controller.Get(1, siteId, include);

			_enrollments.Verify(e => e.GetEnrollmentsForSiteAsync(siteId, null, null, include, 0, null), Times.Once());
		}

		[Fact]
		public async Task Get_Id_IncludeEntities_GetsEnrollmentForSite_WithEntities()
		{
			var _enrollments = new Mock<IEnrollmentRepository>();
			var _sites = new Mock<ISiteRepository>();
			var _mapper = new Mock<IMapper>();

			var controller = new EnrollmentsController(_enrollments.Object, _sites.Object, _mapper.Object);

			var id = 1;
			var siteId = 1;
			var include = new string[] { "foo" };
			await controller.Get(id, 1, siteId, include);

			_enrollments.Verify(e => e.GetEnrollmentForSiteAsync(id, siteId, include), Times.Once());
		}

		[Theory]
		[InlineData(0, true, typeof(CreatedAtActionResult))]
		[InlineData(1, false, typeof(BadRequestResult))]
		public async Task Post_AddsEnrollment_IfValid(
			int id,
			bool shouldAddEnrollment,
			Type resultType
		)
		{
			var _enrollments = new Mock<IEnrollmentRepository>();
			var _sites = new Mock<ISiteRepository>();
			var _mapper = new Mock<IMapper>();

			var controller = new EnrollmentsController(_enrollments.Object, _sites.Object, _mapper.Object);

			var enrollment = new Enrollment { Id = id };

			var result = await controller.Post(1, 1, enrollment);
			var times = shouldAddEnrollment ? Times.Once() : Times.Never();
			_enrollments.Verify(e => e.AddEnrollment(It.IsAny<Enrollment>()), times);

			Assert.IsType(resultType, result.Result);
		}


		[Theory]
		[InlineData(1, 1, false, true, typeof(OkObjectResult))]
		[InlineData(1, 2, false, false, typeof(BadRequestResult))]
		[InlineData(1, 1, true, true, typeof(NotFoundResult))]
		public async Task Put_UpdatesEnrollment_IfValid_AndExists(
			int pathId,
			int id,
			bool shouldNotFind,
			bool shouldUpdateEnrollment,
			Type resultType
		)
		{
			var _enrollments = new Mock<IEnrollmentRepository>();
			if (shouldNotFind)
			{
				_enrollments.Setup(e => e.SaveChangesAsync())
					.Throws(new DbUpdateConcurrencyException());
			}

			var _sites = new Mock<ISiteRepository>();
			var _mapper = new Mock<IMapper>();
			_mapper.Setup(m => m.Map<Enrollment, EnrollmentDTO>(It.IsAny<Enrollment>()))
				.Returns(It.IsAny<EnrollmentDTO>());

			var controller = new EnrollmentsController(_enrollments.Object, _sites.Object, _mapper.Object);

			var enrollment = new Enrollment { Id = id };

			var result = await controller.Put(pathId, 1, 1, enrollment);
			var times = shouldUpdateEnrollment ? Times.Once() : Times.Never();
			_enrollments.Verify(e => e.UpdateEnrollment(It.IsAny<Enrollment>(), It.IsAny<EnrollmentDTO>()), times);
			Assert.IsType(resultType, result.Result);
		}

		[Theory]
		[InlineData(1, 1, false, true, typeof(OkResult))]
		[InlineData(1, 2, false, false, typeof(BadRequestResult))]
		[InlineData(1, 1, true, true, typeof(NotFoundResult))]
		public async Task Delete_RemovesEnrollment_IfValid_AndExists(
			int pathId,
			int id,
			bool shouldNotFind,
			bool shouldDeleteEnrollment,
			Type resultType
		)
		{
			var _enrollments = new Mock<IEnrollmentRepository>();
			if (shouldNotFind)
			{
				_enrollments.Setup(e => e.SaveChangesAsync())
					.Throws(new DbUpdateConcurrencyException());
			}

			var _sites = new Mock<ISiteRepository>();
			var _mapper = new Mock<IMapper>();

			var controller = new EnrollmentsController(_enrollments.Object, _sites.Object, _mapper.Object);

			var enrollment = new Enrollment { Id = id };

			var result = await controller.Delete(pathId, 1, 1, enrollment);
			var times = shouldDeleteEnrollment ? Times.Once() : Times.Never();
			_enrollments.Verify(e => e.DeleteEnrollment(It.IsAny<Enrollment>()), times);
			Assert.IsType(resultType, result);
		}
	}
}
