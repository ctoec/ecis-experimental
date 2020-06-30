using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hedwig.Repositories
{
	public class EnrollmentRepository : HedwigRepository, IEnrollmentRepository
	{
		readonly IChildRepository _childRepository;
		readonly IFundingRepository _fundingRepository;
		readonly ISiteRepository _siteRepository;

		public EnrollmentRepository(HedwigContext context) : base(context) {
			_childRepository = new ChildRepository(context);
			_fundingRepository = new FundingRepository(context);
			_siteRepository = new SiteRepository(context);
		}

		public Enrollment GetEnrollmentById(int id)
		{
			return _context.Enrollments
				.Include(e => e.Child)
				.Include(e => e.Fundings)
				.SingleOrDefault(e => e.Id == id);
		}

		public void UpdateEnrollment(Enrollment enrollment, EnrollmentDTO enrollmentDTO)
		{
			UpdateHedwigIdEntityWithNavigationProperties<Enrollment, EnrollmentDTO, int>(enrollment, enrollmentDTO);
		}

		public void AddEnrollment(Enrollment enrollment)
		{
			_context.Add(enrollment);
		}

		public async Task<List<Enrollment>> GetEnrollmentsForSiteAsync(
			int siteId,
			DateTime? from = null,
			DateTime? to = null,
			int skip = 0,
			int? take = null
		)
		{
			var enrollments = _context.Enrollments
				.FilterByDates(from, to)
				.Where(e => e.SiteId == siteId)
				.IncludeEnrollmentForSite()
				.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			return await enrollments.OrderBy(e => e.Id).ToListAsync();
		}

		public async Task<List<EnrollmentDTO>> GetEnrollmentDTOsForSiteAsync(
			int siteId,
			DateTime? from = null,
			DateTime? to = null,
			int skip = 0,
			int? take = null
		)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var enrollments = _context.Enrollments
				.FilterByDates(from, to)
				.Where(e => e.SiteId == siteId)
				.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			var esDTOs = await enrollments.OrderBy(e => e.Id)
				.SelectEnrollmentDTO()
				.ToListAsync();
			CompleteEnrollmentDTOs(esDTOs);
			return esDTOs;
		}

		public async Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId)
		{
			var enrollment = _context.Enrollments
				.Where(e => e.SiteId == siteId && e.Id == id)
				.IncludeEnrollmentForSite()
				.FirstOrDefault();

			// handle special include of un-mapped properties
			if (enrollment != null)
			{
				var pastEnrollments = _context.Enrollments.Where(
					e => e.ChildId == enrollment.ChildId
					// TODO: Add validations for multiple enrollments (cannot overlap, only one enrollment without entry/exit)
					&& e.Entry.HasValue
					&& e.Entry < enrollment.Entry
				)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FundingSpace)
						.ThenInclude(f => f.TimeSplit)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FirstReportingPeriod)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.LastReportingPeriod)
				.Include(e => e.Site)
				.ToList();

				enrollment.PastEnrollments = pastEnrollments;
			}

			return await Task.FromResult(enrollment);
		}

		public async Task<EnrollmentDTO> GetEnrollmentDTOForSiteAsync(int id, int siteId)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var eDTO = await Task.FromResult(_context.Enrollments
				.Where(e => e.SiteId == siteId && e.Id == id)
				.SelectEnrollmentDTO()
				.FirstOrDefault());
			await Task.Run(() => CompleteEnrollmentDTO(eDTO));
			return eDTO;
		}

		public async Task<List<EnrollmentDTO>> GetEnrollmentDTOsForOrganizationAsync(
			int orgId,
			DateTime? from = null,
			DateTime? to = null,
			DateTime? asOf = null,
			int skip = 0,
			int? take = null
		)
		{
			_context.ChangeTracker.LazyLoadingEnabled = false;
			var enrollments =
				(asOf != null ? _context.Enrollments.AsOf((DateTime)asOf) : _context.Enrollments)
				.FilterByDates(from, to)
				.Where(e => e.Site.OrganizationId == orgId)
				.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			var esDTOs = await enrollments
				.SelectEnrollmentDTO()
				.OrderBy(e => e.Id)
				.ToListAsync();
			CompleteEnrollmentDTOs(esDTOs);
			return esDTOs;
		}

		public void DeleteEnrollment(Enrollment enrollment)
		{
			_context.Enrollments.Remove(enrollment);
		}

		void CompleteEnrollmentDTOs(IEnumerable<EnrollmentDTO> esDTOs)
		{
			var childIds = esDTOs.Select(esDTO => esDTO.ChildId).Distinct();
			var siteIds = esDTOs.Select(esDTO => esDTO.SiteId).Distinct();
			var ids = esDTOs.Select(esDTO => esDTO.Id).Distinct();
			var children = _childRepository.GetEnrollmentChildDTOsByIds(childIds);
			var sites = _siteRepository.GetOrganizationSiteDTOsByIds(siteIds);
			var fundings = _fundingRepository.GetFundingDTOsByEnrollmentIds(ids);
			foreach(var esDTO in esDTOs)
			{
				esDTO.Child = children.FirstOrDefault(c => c.Id == esDTO.ChildId);
				esDTO.Site = sites.FirstOrDefault(s => s.Id == esDTO.SiteId);
				esDTO.Fundings = fundings.Where(f => f.EnrollmentId == esDTO.Id).ToList();
			}
		}

		void CompleteEnrollmentDTO(EnrollmentDTO eDTO)
		{
			eDTO.Child = _childRepository.GetEnrollmentChildDTOById(eDTO.ChildId);
			eDTO.Site = _siteRepository.GetOrganizationSiteDTOById(eDTO.SiteId);
			eDTO.Fundings = _fundingRepository.GetFundingDTOsByEnrollmentId(eDTO.Id);
		}

	}

	public interface IEnrollmentRepository : IHedwigRepository
	{
		void UpdateEnrollment(Enrollment enrollment, EnrollmentDTO enrollmentDTO);
		void AddEnrollment(Enrollment enrollment);
		Task<List<Enrollment>> GetEnrollmentsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, int skip = 0, int? take = null);
		Task<List<EnrollmentDTO>> GetEnrollmentDTOsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, int skip = 0, int? take = null);
		Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId);
		Task<EnrollmentDTO> GetEnrollmentDTOForSiteAsync(int id, int siteId);
		Task<List<EnrollmentDTO>> GetEnrollmentDTOsForOrganizationAsync(int orgId, DateTime? from = null, DateTime? to = null, DateTime? asOf = null, int skip = 0, int? take = null);
		Enrollment GetEnrollmentById(int id);

		void DeleteEnrollment(Enrollment enrollment);
	}

	public static class EnrollmentQueryExtensions
	{
		public static IQueryable<Enrollment> FilterByDates(this IQueryable<Enrollment> query, DateTime? from, DateTime? to)
		{
			if (from.HasValue && to.HasValue)
			{
				return query.Where(e => (
					(e.Exit != null && e.Entry <= to && e.Exit >= from)
					||
					(e.Exit == null && e.Entry <= to)
					||
					(e.Entry == null)
				));
			}

			return query;
		}

		public static IQueryable<EnrollmentDTO> SelectEnrollmentDTO(this IQueryable<Enrollment> query)
		{
			return query.Select(e => new EnrollmentDTO()
			{
				Id = e.Id,
				ChildId = e.ChildId,
				SiteId = e.SiteId,
				AgeGroup = e.AgeGroup,
				Entry = e.Entry,
				Exit = e.Exit,
				ExitReason = e.ExitReason,
				ValidationErrors = e.ValidationErrors,
			});
		}

		public static IQueryable<Enrollment> IncludeEnrollmentForSite(this IQueryable<Enrollment> query)
		{
			return query
				.Include(e => e.Author)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FundingSpace)
						.ThenInclude(fs => fs.TimeSplit)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FirstReportingPeriod)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.LastReportingPeriod)
				.Include(e => e.Child)
					.ThenInclude(c => c.C4KCertificates)
				.Include(e => e.Child)
					.ThenInclude(c => c.Family)
						.ThenInclude(f => f.Determinations)
				.Include(e => e.Site);
		}

	}
}
