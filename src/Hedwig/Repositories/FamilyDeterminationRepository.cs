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
