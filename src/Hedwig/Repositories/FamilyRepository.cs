using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
	public class FamilyRepository : HedwigRepository, IFamilyRepository
	{
		public FamilyRepository(HedwigContext context) : base(context) { }

		public Family GetFamilyById(int id)
		{
			var family = _context.Families
				.Where(f => f.Id == id);

			return family.FirstOrDefault();
		}
	}
	public interface IFamilyRepository
	{
		Family GetFamilyById(int id);
	}
}
