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
	}

	public interface IFundingSpaceRepository : IHedwigRepository
	{
		FundingSpace GetById(int id);
	}
}
