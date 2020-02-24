using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
  public class FamilyRepository : HedwigRepository, IFamilyRepository
  {
	public FamilyRepository(HedwigContext context) : base(context) { }

	public Family GetFamilyById(int id)
	{
	  var family = _context.Families
		  .AsNoTracking()
		  .Where(f => f.Id == id);

	  return family.FirstOrDefault();
	}
  }
  public interface IFamilyRepository
  {
	Family GetFamilyById(int id);
  }
}
