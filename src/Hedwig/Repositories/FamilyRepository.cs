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
		FamilyDeterminationRepository _familyDeterminationRepository;
		public FamilyRepository(HedwigContext context) : base(context)
		{
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
				.SelectEnrollmentFamilyDTO()
				.FirstOrDefault();
			fDTO.Determinations = _familyDeterminationRepository.GetEnrollmentFamilyDeterminationDTOsByFamilyId(id);
			return fDTO;
		}

		public List<EnrollmentFamilyDTO> GetEnrollmentFamilyDTOsByIds(IEnumerable<int> ids)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var fDTOs = _context.Families
				.Where(f => ids.Contains(f.Id))
				.SelectEnrollmentFamilyDTO()
				.ToList();
			var determinations = _familyDeterminationRepository.GetEnrollmentFamilyDeterminationDTOsByFamilyIds(ids);
			fDTOs.ForEach(fDTO =>
			{
				fDTO.Determinations = determinations.Where(d => d.FamilyId == fDTO.Id).ToList();
			});
			return fDTOs;
		}
	}

	public static class FamilyQueryExtensions
	{
		public static IQueryable<EnrollmentFamilyDTO> SelectEnrollmentFamilyDTO(this IQueryable<Family> query)
		{
			return query.Select(f => new EnrollmentFamilyDTO()
			{
				Id = f.Id,
				AddressLine1 = f.AddressLine1,
				AddressLine2 = f.AddressLine2,
				Town = f.Town,
				State = f.State,
				Zip = f.Zip,
				Homelessness = f.Homelessness,
				OrganizationId = f.OrganizationId
			});
		}
	}

	public interface IFamilyRepository
	{
		Family GetFamilyById(int id);
		EnrollmentFamilyDTO GetEnrollmentFamilyDTOById(int id);
		List<EnrollmentFamilyDTO> GetEnrollmentFamilyDTOsByIds(IEnumerable<int> ids);
	}
}
