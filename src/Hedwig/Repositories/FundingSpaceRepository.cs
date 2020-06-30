using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
	public class FundingSpaceRepository : HedwigRepository, IFundingSpaceRepository
	{
		public FundingSpaceRepository(HedwigContext context) : base(context) { }

		public FundingSpace GetById(int id)
		{
			return _context.FundingSpaces
				.Where(space => space.Id == id)
				.Include(space => space.TimeSplit)
				.FirstOrDefault();
		}

		public List<FundingSpaceDTO> GetFundingSpaceDTOsByIds(IEnumerable<int?> ids)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.FundingSpaces
				.SelectFundingSpaceDTO()
				.Where(space => ids.Contains(space.Id))
				.ToList();
		}

		public ICollection<FundingSpaceDTO> GetFundingSpaceDTOsForOrganiation(int organiationId)
		{
			return _context.FundingSpaces
				.SelectFundingSpaceDTO()
				.Where(fs => fs.OrganizationId == organiationId)
				.ToList();
		}
	}

	public static class FundingSpaceQueryExtensions
	{
		public static IQueryable<FundingSpaceDTO> SelectFundingSpaceDTO(this IQueryable<FundingSpace> query)
		{
			return query.Select(fs => new FundingSpaceDTO()
			{
				Id = fs.Id,
				Capacity = fs.Capacity,
				OrganizationId = fs.OrganizationId,
				Source = fs.Source,
				AgeGroup = fs.AgeGroup,
				Time = fs.Time,
				TimeSplit = fs.TimeSplit
			});
		}
	}

	public interface IFundingSpaceRepository : IHedwigRepository
	{
		FundingSpace GetById(int id);
		List<FundingSpaceDTO> GetFundingSpaceDTOsByIds(IEnumerable<int?> ids);
		public ICollection<FundingSpaceDTO> GetFundingSpaceDTOsForOrganiation(int organiationId);
	}
}
