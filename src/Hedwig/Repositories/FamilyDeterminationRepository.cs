using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class FamilyDeterminationRepository : HedwigRepository, IFamilyDeterminationRepository
	{
		public FamilyDeterminationRepository(HedwigContext context) : base(context) { }

		public List<FamilyDetermination> GetDeterminationsByFamilyIdAsNoTracking(int familyId)
		{
			return _context.FamilyDeterminations
				.Where(fd => fd.FamilyId == familyId)
				.AsNoTracking()
				.ToList();
		}
	}

	public interface IFamilyDeterminationRepository
	{
		List<FamilyDetermination> GetDeterminationsByFamilyIdAsNoTracking(int familyId);
	}
}
