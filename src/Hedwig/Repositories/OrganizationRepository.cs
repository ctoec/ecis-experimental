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
		IFundingSpaceRepository _fundingSpaceRepository;
		ISiteRepository _siteRepository;

		public OrganizationRepository(HedwigContext context)
			: base(context) {
			this._fundingSpaceRepository = new FundingSpaceRepository(context);
			this._siteRepository = new SiteRepository(context);
		}

		public Organization GetOrganizationById(int id)
		{
			return _context.Organizations
				.Where(o => o.Id == id)
				.Include(o => o.FundingSpaces)
				.ThenInclude(fs => fs.TimeSplit)
				.Include(o => o.Sites)
				.ThenInclude(s => s.Enrollments)
				.FirstOrDefault();
		}

		public EnrollmentSummaryOrganizationDTO GetEnrollmentSummaryOrganizationDTOById(int id)
		{
			return _context.Organizations
				.Select(o => new EnrollmentSummaryOrganizationDTO() {
					Id = o.Id,
					Name = o.Name,
					Sites = _siteRepository.GetEnrollmentSummarySiteDTOsForOrganization(o.Id),
					FundingSpaces = _fundingSpaceRepository.GetFundingSpaceDTOsForOrganiation(o.Id)
				})
				.SingleOrDefault(o => o.Id == id);
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
		Organization GetOrganizationById(int id);

		EnrollmentSummaryOrganizationDTO GetEnrollmentSummaryOrganizationDTOById(int id);

		List<Organization> GetOrganizationsWithFundingSpaces(FundingSource source);
	}
}
