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

		public FundingRepository(HedwigContext context) : base(context) { }

		public List<Funding> GetFundingsByEnrollmentId(int enrollmentId)
		{
			return _context.Fundings
				.Where(f => f.EnrollmentId == enrollmentId)
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
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
		List<Funding> GetFundingsByChildId(Guid childId);
	}
}
