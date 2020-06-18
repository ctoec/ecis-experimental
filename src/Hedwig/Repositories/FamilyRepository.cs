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
		FamilyDeterminationRepository _familyDeterminationRepository;
		public FamilyRepository(HedwigContext context) : base(context) {
			_familyDeterminationRepository = new FamilyDeterminationRepository(context);
		}

		public Family GetFamilyById(int id)
		{
			var family = _context.Families
				.Where(f => f.Id == id);

			return family.FirstOrDefault();
		}

		public EnrollmentFamilyDTO GetEnrollmentFamilyDTOById(int id)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var fDTO = _context.Families
				.Where(f => f.Id == id)
				.Select(f => new EnrollmentFamilyDTO()
				{
					Id = f.Id,
					AddressLine1 = f.AddressLine1,
					AddressLine2 = f.AddressLine2,
					Town = f.Town,
					State = f.State,
					Zip = f.Zip,
					Homelessness = f.Homelessness,
					OrganizationId = f.OrganizationId
				})
				.FirstOrDefault();
			fDTO.Determinations = _familyDeterminationRepository.GetEnrollmentFamilyDeterminationDTOsByFamilyId(id);
			return fDTO;
		}
	}
	public interface IFamilyRepository
	{
		Family GetFamilyById(int id);
	}
}
