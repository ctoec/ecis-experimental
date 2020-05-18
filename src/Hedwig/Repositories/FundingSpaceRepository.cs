using Hedwig.Models;
using Hedwig.Data;
using System.Linq;

namespace Hedwig.Repositories
{
	public class FundingSpaceRepository : HedwigRepository, IFundingSpaceRepository
	{
		public FundingSpaceRepository(HedwigContext context) : base(context) { }
		public FundingSpace GetById(int id)
		{
			return _context.FundingSpaces
				.FirstOrDefault(space => space.Id == id);
		}
	}

	public interface IFundingSpaceRepository : IHedwigRepository
	{
		FundingSpace GetById(int id);
	}
}
