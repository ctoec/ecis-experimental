using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

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
					&& s.OrganizationId == organizationId);

			site = site.Include(s => s.Organization);

			site = ((IIncludableQueryable<Site, Organization>)site)
				.ThenInclude(o => o.FundingSpaces)
					.ThenInclude(fs => fs.TimeSplit);

			// Chaining of multiple ThenIncludes is not supported, so to include both
			// enrollment fundings and enrollment children requires separate calls to include enrollments
			site = site.Include(s => s.Enrollments)
				.ThenInclude(e => e.Fundings)
					.ThenInclude(f => f.FirstReportingPeriod)
			.Include(s => s.Enrollments)
				.ThenInclude(e => e.Fundings)
					.ThenInclude(f => f.LastReportingPeriod);

			// Calls from front end don't appear to include "child"
			//site = site.Include(s => s.Enrollments).ThenInclude(e => e.Child);

			// Only if Fundings not included, but they are by default
			//site = site.Include(s => s.Enrollments);

			return site.FirstOrDefaultAsync();
		}

		public Site GetSiteById(int id)
		{
			return _context.Sites.FirstOrDefault(site => site.Id == id);
		}

		public OrganizationSiteDTO GetOrganizationSiteDTOById(int id)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.Sites
				.Select(s => new OrganizationSiteDTO()
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
				})
				.FirstOrDefault(site => site.Id == id);
		}

		public EnrollmentSummarySiteDTO GetEnrollmentSummarySiteDTOById(int id)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.Sites
				.Select(s => new EnrollmentSummarySiteDTO() {
					Id = s.Id,
					Name = s.Name
				})
				.FirstOrDefault(site => site.Id == id);
		}

		public List<EnrollmentSummarySiteDTO> GetEnrollmentSummarySiteDTOsByIds(IEnumerable<int> ids)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.Sites
				.Select(s => new EnrollmentSummarySiteDTO()
				{
					Id = s.Id,
					Name = s.Name
				})
				.Where(site => ids.Contains(site.Id))
				.ToList();
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

		EnrollmentSummarySiteDTO GetEnrollmentSummarySiteDTOById(int id);

		List<EnrollmentSummarySiteDTO> GetEnrollmentSummarySiteDTOsByIds(IEnumerable<int> ids);
	}
}
