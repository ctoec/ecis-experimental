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
		public Organization GetOrganizationById(int id, string[] include = null)
		{
			var organization = _context.Organizations
				.Where(o => o.Id == id);

			include = include ?? new string[] { };
			if (include.Contains(INCLUDE_FUNDING_SPACES))
			{
				organization = organization.Include(o => o.FundingSpaces)
					.ThenInclude(fs => fs.TimeSplit);
			}
			if (include.Contains(INCLUDE_SITES))
			{
				organization = organization.Include(o => o.Sites);

				if (include.Contains(INCLUDE_ENROLLMENTS))
				{
					organization = ((IIncludableQueryable<Organization, Site>)organization).ThenInclude(s => s.Enrollments);
				}
			}

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
		Organization GetOrganizationById(int id, string[] include = null);
		List<Organization> GetOrganizationsWithFundingSpaces(FundingSource source);
	}
}
