using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

		public List<EnrollmentFamilyDeterminationDTO> GetEnrollmentFamilyDeterminationDTOsByFamilyId(int familyId)
		{
			return GetEnrollmentFamilyDeterminationDTOsByFamilyIds(new List<int> { familyId });
		}

		public List<EnrollmentFamilyDeterminationDTO> GetEnrollmentFamilyDeterminationDTOsByFamilyIds(IEnumerable<int> familyIds)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			return _context.FamilyDeterminations
				.Where(fd => familyIds.Contains(fd.FamilyId))
				.SelectEnrollmentFamilyDeterminationDTO()
				.ToList();
		}
	}

	public static class FamilyDeterminationQueryExtensions
	{
		public static IQueryable<EnrollmentFamilyDeterminationDTO> SelectEnrollmentFamilyDeterminationDTO(this IQueryable<FamilyDetermination> query)
		{
			return query.Select(fd => new EnrollmentFamilyDeterminationDTO()
			{
				Id = fd.Id,
				NumberOfPeople = fd.NumberOfPeople,
				Income = fd.Income,
				DeterminationDate = fd.DeterminationDate,
				FamilyId = fd.FamilyId,
				ValidationErrors = fd.ValidationErrors,
			});
		}
	}

	public interface IFamilyDeterminationRepository
	{
		List<FamilyDetermination> GetDeterminationsByFamilyId(int familyId);
		List<EnrollmentFamilyDeterminationDTO> GetEnrollmentFamilyDeterminationDTOsByFamilyId(int familyId);
		List<EnrollmentFamilyDeterminationDTO> GetEnrollmentFamilyDeterminationDTOsByFamilyIds(IEnumerable<int> familyIds);
	}
}
