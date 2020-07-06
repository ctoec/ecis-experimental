using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
	public class FundingRepository : HedwigRepository, IFundingRepository
	{
		readonly IFundingSpaceRepository _fundingSpaceRepository;

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
			return GetFundingDTOsByEnrollmentIds(new List<int> { enrollmentId });
		}

		public List<FundingDTO> GetFundingDTOsByEnrollmentIds(IEnumerable<int> enrollmentIds)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var fDTOs = _context.Fundings
				.Where(f => enrollmentIds.Contains(f.EnrollmentId))
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
				.Select(f => new FundingDTO()
				{
					Id = f.Id,
					EnrollmentId = f.EnrollmentId,
					FundingSpaceId = f.FundingSpaceId,
					Source = f.Source,
					FirstReportingPeriodId = f.FirstReportingPeriodId,
					FirstReportingPeriod = f.FirstReportingPeriod,
					LastReportingPeriodId = f.LastReportingPeriodId,
					LastReportingPeriod = f.LastReportingPeriod,
					ValidationErrors = f.ValidationErrors,
				})
				.ToList();
			var fsIds = fDTOs.Select(fDTO => fDTO.FundingSpaceId);
			var fundingSpaces = _fundingSpaceRepository.GetFundingSpaceDTOsByIds(fsIds);
			foreach (var fDTO in fDTOs)
			{
				fDTO.FundingSpace = fundingSpaces.FirstOrDefault(fs => fs.Id == fDTO.FundingSpaceId);
			}
			return fDTOs;
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
		List<FundingDTO> GetFundingDTOsByEnrollmentIds(IEnumerable<int> enrollmentIds);
		List<Funding> GetFundingsByChildId(Guid childId);
	}
}
