using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;

namespace Hedwig.Repositories
{
	public class OrganizationRepository : HedwigRepository, IOrganizationRepository
	{

		public OrganizationRepository(HedwigContext context) : base(context) { }
		public EnrollmentSummaryOrganizationDTO GetOrganizationById(int id)
		{
			return _context.Organizations
				.Where(o => o.Id == id)
			  .Include(o => o.FundingSpaces)
				.ThenInclude(fs => fs.TimeSplit)
				.Include(o => o.Sites)
				.ThenInclude(s => s.Enrollments)
        .Select(o => new EnrollmentSummaryOrganizationDTO()).FirstOrDefault();
		}

		public List<Organization> GetOrganizationsWithFundingSpaces(FundingSource source)
		{
			return _context.Organizations
				.Include(organization => organization.FundingSpaces)
				.Where(organization => organization.FundingSpaces.Any(fundingSpace => fundingSpace.Source == source))
				.ToList();
		}
	}

	public interface IOrganizationRepository : IHedwigRepository
	{
		EnrollmentSummaryOrganizationDTO GetOrganizationById(int id);
		List<Organization> GetOrganizationsWithFundingSpaces(FundingSource source);
	}
}
