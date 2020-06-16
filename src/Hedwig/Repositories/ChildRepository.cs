using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

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
			return _context.Children
				.Select(c => new EnrollmentChildDTO()
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
					Family = c.FamilyId.HasValue ? _familyRepository.GetEnrollmentFamilyDTOById(c.FamilyId.Value) : null,
					OrganizationId = c.OrganizationId,
					C4KFamilyCaseNumber = c.C4KFamilyCaseNumber,
					C4KCertificates = _c4KCertificateRepository.GetC4KCertificateDTOsByChildId(c.Id),
					ValidationErrors = c.ValidationErrors
				})
				.Single(c => c.Id == id);
		}
		public EnrollmentSummaryChildDTO GetEnrollmentSummaryChildDTOById(Guid id)
		{
			return _context.Children
				.Select(c => new EnrollmentSummaryChildDTO()
				{
					Id = c.Id,
					Sasid = c.Sasid,
					FirstName = c.FirstName,
					MiddleName = c.MiddleName,
					LastName = c.LastName,
					Suffix = c.Suffix,
					Birthdate = c.Birthdate,
					C4KCertificates = _c4KCertificateRepository.GetC4KCertificateDTOsByChildId(c.Id),
					ValidationErrors = c.ValidationErrors
				})
				.Single(c => c.Id == id);
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
		EnrollmentSummaryChildDTO GetEnrollmentSummaryChildDTOById(Guid id);
	}
}
