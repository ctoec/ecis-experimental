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

		public FundingRepository(HedwigContext context) : base(context) { }

		public List<Funding> GetFundingsByEnrollmentIdAsNoTracking(int enrollmentId)
		{
			return _context.Fundings
				.AsNoTracking()
				.Where(f => f.EnrollmentId == enrollmentId)
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
				.ToList();
		}

		public List<Funding> GetFundingsByChildIdAsNoTracking(Guid childId)
		{
			return _context.Fundings
				.AsNoTracking()
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
				.Include(f => f.Enrollment)
				.Where(f => f.Enrollment.ChildId == childId)
				.ToList();
		}
	}

	public interface IFundingRepository : IHedwigRepository
	{
		List<Funding> GetFundingsByEnrollmentIdAsNoTracking(int enrollmentId);
		List<Funding> GetFundingsByChildIdAsNoTracking(Guid childId);
	}
}
