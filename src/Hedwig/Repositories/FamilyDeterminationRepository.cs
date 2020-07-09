using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;

namespace Hedwig.Repositories
{
	public class FamilyDeterminationRepository : HedwigRepository, IFamilyDeterminationRepository
	{
		public FamilyDeterminationRepository(HedwigContext context) : base(context) { }

		public List<FamilyDetermination> GetDeterminationsByFamilyId(int familyId)
		{
			return _context.FamilyDeterminations
				.Where(fd => fd.FamilyId == familyId)
				.ToList();
		}
	}

	public interface IFamilyDeterminationRepository
	{
		List<FamilyDetermination> GetDeterminationsByFamilyId(int familyId);
	}
}
