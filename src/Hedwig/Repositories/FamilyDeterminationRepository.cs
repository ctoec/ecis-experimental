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

		public List<EnrollmentFamilyDeterminationDTO> GetEnrollmentFamilyDeterminationDTOsByFamilyId(int familyId)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.FamilyDeterminations
				.Where(fd => fd.FamilyId == familyId)
				.Select(fd => new EnrollmentFamilyDeterminationDTO() {
					Id = fd.Id,
					NumberOfPeople = fd.NumberOfPeople,
					Income = fd.Income,
					DeterminationDate = fd.DeterminationDate,
					FamilyId = fd.FamilyId,
					ValidationErrors = fd.ValidationErrors,
				})
				.ToList();
		}
	}

	public interface IFamilyDeterminationRepository
	{
		List<FamilyDetermination> GetDeterminationsByFamilyId(int familyId);

		List<EnrollmentFamilyDeterminationDTO> GetEnrollmentFamilyDeterminationDTOsByFamilyId(int familyId);
	}
}
