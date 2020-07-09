using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
	public class OrganizationRepository : HedwigRepository, IOrganizationRepository
	{

		public OrganizationRepository(HedwigContext context) : base(context) { }

		public Task<Organization> GetOrganizationByIdAsync(int id) {
			return _context.Organizations
				.Where(o => o.Id == id)
				.Include(o => o.Sites)
				.Include(o => o.FundingSpaces)
					.ThenInclude(fs => fs.TimeSplit)
				.FirstOrDefaultAsync();
		}
		public Organization GetOrganizationWithFundingSpaces(int id)
		{
			var organization = _context.Organizations
				.Where(o => o.Id == id);

			organization = organization.Include(o => o.FundingSpaces)
				.ThenInclude(fs => fs.TimeSplit);

			return organization.FirstOrDefault();
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
		Task<Organization> GetOrganizationByIdAsync(int id);
		Organization GetOrganizationWithFundingSpaces(int id);
		List<Organization> GetOrganizationsWithFundingSpaces(FundingSource source);
	}
}
