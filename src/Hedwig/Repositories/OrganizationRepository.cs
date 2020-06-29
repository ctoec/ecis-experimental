using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

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
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var oDTO = _context.Organizations
				.Select(o => new EnrollmentSummaryOrganizationDTO() {
					Id = o.Id,
					Name = o.Name
				})
				.SingleOrDefault(o => o.Id == id);
			oDTO.Sites = _siteRepository.GetEnrollmentSummarySiteDTOsForOrganization(id);
			oDTO.FundingSpaces = _fundingSpaceRepository.GetFundingSpaceDTOsForOrganiation(id);
			return oDTO;
		}

		public OrganizationReportSummaryOrganizationDTO GetOrganizationReportSummaryOrganizationDTOById(int id)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.Organizations
				.Where(o => o.Id == id)
				.Select(o => new OrganizationReportSummaryOrganizationDTO()
				{
					Name = o.Name
				})
				.SingleOrDefault();
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

		OrganizationReportSummaryOrganizationDTO GetOrganizationReportSummaryOrganizationDTOById(int orgId);

		List<Organization> GetOrganizationsWithFundingSpaces(FundingSource source);
	}
}
