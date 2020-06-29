using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hedwig.Repositories
{
	public class SiteRepository : HedwigRepository, ISiteRepository
	{
		public SiteRepository(HedwigContext context) : base(context) { }

		public async Task<List<Site>> GetSitesForOrganizationAsync(int organizationId)
		{
			return await _context.Sites
				.Where(s => s.OrganizationId == organizationId)
				.ToListAsync();
		}

		public async Task<List<EnrollmentSummarySiteDTO>> GetEnrollmentSummarySiteDTOsForOrganizationAsync(int organizationId)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return await _context.Sites
				.Where(s => s.OrganizationId == organizationId)
				.Select(s => new EnrollmentSummarySiteDTO()
				{
					Id = s.Id,
					Name = s.Name
				})
				.ToListAsync();
		}

		public List<EnrollmentSummarySiteDTO> GetEnrollmentSummarySiteDTOsForOrganization(int organizationId)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.Sites
				.Where(s => s.OrganizationId == organizationId)
				.Select(s => new EnrollmentSummarySiteDTO()
				{
					Id = s.Id,
					Name = s.Name
				})
				.ToList();
		}

		public Task<Site> GetSiteForOrganizationAsync(int id, int organizationId)
		{
			var site = _context.Sites
				.Where(s => s.Id == id
					&& s.OrganizationId == organizationId)
			  .Include(s => s.Organization)
					.ThenInclude(o => o.FundingSpaces)
						.ThenInclude(fs => fs.TimeSplit)
				.Include(s => s.Enrollments)
					.ThenInclude(e => e.Fundings)
						.ThenInclude(f => f.FirstReportingPeriod)
				.Include(s => s.Enrollments)
					.ThenInclude(e => e.Fundings)
						.ThenInclude(f => f.LastReportingPeriod);

			return site.FirstOrDefaultAsync();
		}

		public Site GetSiteById(int id)
		{
			return _context.Sites.FirstOrDefault(site => site.Id == id);
		}

		public OrganizationSiteDTO GetOrganizationSiteDTOById(int id)
		{
			return GetOrganizationSiteDTOsByIds(new List<int> { id }).FirstOrDefault();
		}

		public List<OrganizationSiteDTO> GetOrganizationSiteDTOsByIds(IEnumerable<int> ids)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.Sites
				.SelectOrganizationSiteDTO()
				.Where(site => ids.Contains(site.Id))
				.ToList();
		}
	}

	public static class SiteQueryExtensions
	{
		public static IQueryable<OrganizationSiteDTO> SelectOrganizationSiteDTO(this IQueryable<Site> query)
		{
			return query.Select(s => new OrganizationSiteDTO()
			{
				Id = s.Id,
				Name = s.Name,
				TitleI = s.TitleI,
				Region = s.Region,
				OrganizationId = s.OrganizationId,
				FacilityCode = s.FacilityCode,
				LicenseNumber = s.LicenseNumber,
				NaeycId = s.NaeycId,
				RegistryId = s.RegistryId,
			});
		}
	}

	public interface ISiteRepository
	{
		Task<List<Site>> GetSitesForOrganizationAsync(int organizationId);

		Task<List<EnrollmentSummarySiteDTO>> GetEnrollmentSummarySiteDTOsForOrganizationAsync(int organizationId);

		List<EnrollmentSummarySiteDTO> GetEnrollmentSummarySiteDTOsForOrganization(int organizationId);

		Task<Site> GetSiteForOrganizationAsync(int id, int organizationId);

		Site GetSiteById(int id);

		OrganizationSiteDTO GetOrganizationSiteDTOById(int id);

		List<OrganizationSiteDTO> GetOrganizationSiteDTOsByIds(IEnumerable<int> ids);
	}
}
