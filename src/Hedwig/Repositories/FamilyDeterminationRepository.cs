using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

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
