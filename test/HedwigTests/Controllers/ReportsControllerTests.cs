using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Hedwig.Repositories;
using Hedwig.Controllers;
using Hedwig.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hedwig.Validations;
using AutoMapper;

namespace HedwigTests.Controllers
{
	public class ReportsControllerTests
	{
		[Fact]
		public void Get_GetsReportsForOrganization()
		{
			var orgId = 1;
			var _reports = new Mock<IReportRepository>();
			var _mapper = new Mock<IMapper>();

			var controller = new ReportsController(_reports.Object, _mapper.Object);

			controller.Get(orgId);
			_reports.Verify(r => r.GetReportsForOrganization(orgId), Times.Once());
		}

		[Theory]
		[InlineData(true, typeof(OkObjectResult))]
		[InlineData(false, typeof(NotFoundResult))]
		public async Task Get_Id_GetsReportForOrganization_IfExists(
			bool exists,
			Type resultType
		)
		{
			var id = 1;
			var orgId = 1;
			var include = new string[] { "foo" };

			var returns = exists ? new CdcReport() : null;
			var _reports = new Mock<IReportRepository>();
			_reports.Setup(r => r.GetReportForOrganizationAsync(id, orgId, include))
				.ReturnsAsync(returns);

			var _mapper = new Mock<IMapper>();

			var controller = new ReportsController(_reports.Object, _mapper.Object);

			var result = await controller.Get(id, orgId, include);

			_reports.Verify(r => r.GetReportForOrganizationAsync(id, orgId, include), Times.Once());
			Assert.IsType(resultType, result.Result);
		}

		[Theory]
		[InlineData(1, 1, false, true, typeof(OkObjectResult))]
		[InlineData(1, 2, false, false, typeof(BadRequestResult))]
		[InlineData(1, 1, true, true, typeof(NotFoundResult))]
		public async Task Put_UpdatesReport_IfValid_AndExists(
			int pathId,
			int id,
			bool shouldNotFind,
			bool shouldUpdateReport,
			Type resultType
		)
		{
			var _reports = new Mock<IReportRepository>();
			if (shouldNotFind)
			{
				_reports.Setup(r => r.SaveChangesAsync())
					.Throws(new DbUpdateConcurrencyException());
			}

			var _mapper = new Mock<IMapper>();
			_mapper.Setup(m => m.Map<CdcReport, CdcReportDTO>(It.IsAny<CdcReport>()))
				.Returns(It.IsAny<CdcReportDTO>());

			var controller = new ReportsController(_reports.Object, _mapper.Object);

			var orgId = 1;
			var report = new CdcReport
			{
				Id = id,
				OrganizationId = orgId,
				ValidationErrors = new List<ValidationError>()
			};

			var result = await controller.Put(pathId, orgId, report);
			var times = shouldUpdateReport ? Times.Once() : Times.Never();
			_reports.Verify(r => r.UpdateReport(report, It.IsAny<CdcReportDTO>()), times);
			Assert.IsType(resultType, result.Result);
		}
	}
}
