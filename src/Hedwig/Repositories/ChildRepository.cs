using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Hedwig.Repositories
{
	public class ChildRepository : HedwigRepository, IChildRepository
	{
		IC4KCertificateRepository _c4KCertificateRepository;
		FamilyRepository _familyRepository;

		public ChildRepository(HedwigContext context) : base(context) {
			_c4KCertificateRepository = new C4KCertificateRepository(context);
			_familyRepository = new FamilyRepository(context);
		}

		public async Task<List<Child>> GetChildrenForOrganizationAsync(
			int organizationId
		)
		{
			var children = _context.Children
				.Where(c => c.OrganizationId == organizationId);

			children = children.Include(c => c.Family);
			children = ((IIncludableQueryable<Child, Family>)children).ThenInclude(f => f.Determinations);

			return await children.ToListAsync();
		}

		public Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId)
		{
			var child = _context.Children
				.Where(c => c.Id == id
					&& c.OrganizationId == organizationId
				);

			child = child.Include(c => c.Family);
			child = ((IIncludableQueryable<Child, Family>)child).ThenInclude(f => f.Determinations);

			return child.FirstOrDefaultAsync();
		}
		public Child GetChildById(Guid id)
		{
			return _context.Children
				.Single(c => c.Id == id);
		}
		public EnrollmentChildDTO GetEnrollmentChildDTOById(Guid id)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var childDTO = _context.Children
				.SelectEnrollmentChildDTO()
				.Single(c => c.Id == id);
			childDTO.Family = childDTO.FamilyId.HasValue ? _familyRepository.GetEnrollmentFamilyDTOById(childDTO.FamilyId.Value) : null;
			childDTO.C4KCertificates = _c4KCertificateRepository.GetC4KCertificateDTOsByChildId(childDTO.Id);
			return childDTO;
		}
		public List<EnrollmentChildDTO> GetEnrollmentChildDTOsByIds(IEnumerable<Guid> ids)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var childDTOs = _context.Children
				.SelectEnrollmentChildDTO()
				.Where(c => ids.Contains(c.Id))
				.ToList();
			var familyIds = childDTOs
				.Where(childDTO => childDTO.FamilyId.HasValue)
				.Select(childDTO => childDTO.FamilyId.GetValueOrDefault());
			var families = _familyRepository.GetEnrollmentFamilyDTOsByIds(familyIds);
			var childIds = childDTOs.Select(childDTO => childDTO.Id).Distinct();
			var c4KCertificates = _c4KCertificateRepository.GetC4KCertificateDTOsByChildIds(childIds);
			foreach (var childDTO in childDTOs)
			{
				childDTO.Family = families.Where(f => f.Id == childDTO.FamilyId).FirstOrDefault();
				childDTO.C4KCertificates = c4KCertificates.Where(c4k => c4k.ChildId == childDTO.Id).ToList();
			}
			return childDTOs;
		}
	
		public EnrollmentSummaryChildDTO GetEnrollmentSummaryChildDTOById(Guid id)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var childDTO = _context.Children
				.SelectEnrollmentSummaryChildDTO()
				.Single(c => c.Id == id);
			childDTO.C4KCertificates = _c4KCertificateRepository.GetC4KCertificateDTOsByChildId(childDTO.Id);
			return childDTO;
		}
		public List<EnrollmentSummaryChildDTO> GetEnrollmentSummaryChildDTOsByIds(IEnumerable<Guid> ids)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var childDTOs = _context.Children
				.SelectEnrollmentSummaryChildDTO()
				.Where(c => ids.Contains(c.Id))
				.ToList();
			var childIds = childDTOs.Select(childDTO => childDTO.Id).Distinct();
			var c4KCertificates = _c4KCertificateRepository.GetC4KCertificateDTOsByChildIds(childIds);
			foreach(var childDTO in childDTOs)
			{
				childDTO.C4KCertificates = c4KCertificates.Where(c4k => c4k.ChildId == childDTO.Id).ToList();
			}
			return childDTOs;
		}
	}

	public static class ChildQueryExtensions
	{
		public static IQueryable<EnrollmentChildDTO> SelectEnrollmentChildDTO(this IQueryable<Child> query)
		{
			return query.Select(c => new EnrollmentChildDTO()
			{
				Id = c.Id,
				Sasid = c.Sasid,
				FirstName = c.FirstName,
				MiddleName = c.MiddleName,
				LastName = c.LastName,
				Suffix = c.Suffix,
				Birthdate = c.Birthdate,
				BirthTown = c.BirthTown,
				BirthState = c.BirthState,
				BirthCertificateId = c.BirthCertificateId,
				AmericanIndianOrAlaskaNative = c.AmericanIndianOrAlaskaNative,
				Asian = c.Asian,
				BlackOrAfricanAmerican = c.BlackOrAfricanAmerican,
				NativeHawaiianOrPacificIslander = c.NativeHawaiianOrPacificIslander,
				White = c.White,
				HispanicOrLatinxEthnicity = c.HispanicOrLatinxEthnicity,
				Gender = c.Gender,
				Foster = c.Foster,
				FamilyId = c.FamilyId,
				OrganizationId = c.OrganizationId,
				C4KFamilyCaseNumber = c.C4KFamilyCaseNumber,
				ValidationErrors = c.ValidationErrors
			});
		}

		public static IQueryable<EnrollmentSummaryChildDTO> SelectEnrollmentSummaryChildDTO(this IQueryable<Child> query)
		{
			return query.Select(c => new EnrollmentSummaryChildDTO()
			{
				Id = c.Id,
				Sasid = c.Sasid,
				FirstName = c.FirstName,
				MiddleName = c.MiddleName,
				LastName = c.LastName,
				Suffix = c.Suffix,
				Birthdate = c.Birthdate,
				ValidationErrors = c.ValidationErrors
			});
		}
	}

	public interface IChildRepository
	{
		Task<List<Child>> GetChildrenForOrganizationAsync(
			int organizationId
		);
		Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId);
		Child GetChildById(Guid id);
		EnrollmentChildDTO GetEnrollmentChildDTOById(Guid id);
		List<EnrollmentChildDTO> GetEnrollmentChildDTOsByIds(IEnumerable<Guid> ids);
		EnrollmentSummaryChildDTO GetEnrollmentSummaryChildDTOById(Guid id);
		List<EnrollmentSummaryChildDTO> GetEnrollmentSummaryChildDTOsByIds(IEnumerable<Guid> ids);
	}
}
