using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using System.Collections.Generic;

namespace Hedwig.Repositories
{
	public class FundingRepository : HedwigRepository, IFundingRepository
	{
		IFundingSpaceRepository _fundingSpaceRepository;

		public FundingRepository(HedwigContext context) : base(context) {
			_fundingSpaceRepository = new FundingSpaceRepository(context);
		}

		public List<Funding> GetFundingsByEnrollmentId(int enrollmentId)
		{
			return _context.Fundings
				.Where(f => f.EnrollmentId == enrollmentId)
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
				.ToList();
		}

		public List<FundingDTO> GetFundingDTOsByEnrollmentId(int enrollmentId)
		{
			return _context.Fundings
				.Where(f => f.EnrollmentId == enrollmentId)
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
				.Select(fDTO => new FundingDTO() {
					Id = fDTO.Id,
					EnrollmentId = fDTO.EnrollmentId,
					FundingSpaceId = fDTO.FundingSpaceId,
					FundingSpace = _fundingSpaceRepository.GetFundingSpaceDTOById(fDTO.FundingSpaceId),
					Source = fDTO.Source,
					FirstReportingPeriodId = fDTO.FirstReportingPeriodId,
					FirstReportingPeriod = fDTO.FirstReportingPeriod,
					LastReportingPeriodId = fDTO.LastReportingPeriodId,
					LastReportingPeriod = fDTO.LastReportingPeriod,
					ValidationErrors = fDTO.ValidationErrors,
				})
				.ToList();
		}

		public List<Funding> GetFundingsByChildId(Guid childId)
		{
			return _context.Fundings
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
				.Include(f => f.Enrollment)
				.Where(f => f.Enrollment.ChildId == childId)
				.ToList();
		}
	}

	public interface IFundingRepository : IHedwigRepository
	{
		List<Funding> GetFundingsByEnrollmentId(int enrollmentId);
		List<FundingDTO> GetFundingDTOsByEnrollmentId(int enrollmentId);
		List<Funding> GetFundingsByChildId(Guid childId);
	}
}
