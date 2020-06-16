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
	public class EnrollmentRepository : HedwigRepository, IEnrollmentRepository
	{
		IChildRepository _childRepository;
		IFundingRepository _fundingRepository;
		ISiteRepository _siteRepository;

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
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FundingSpace)
						.ThenInclude(fs => fs.TimeSplit)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FirstReportingPeriod)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.LastReportingPeriod)
				.Include(e => e.Child)
					.ThenInclude(c => c.C4KCertificates)
				.Include(e => e.Site)
				.Include(e => e.Child)
				.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			return await enrollments.OrderBy(e => e.Id).ToListAsync();
		}

		public async Task<List<EnrollmentSummaryDTO>> GetEnrollmentSummaryDTOsForSiteAsync(
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
				.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			return await enrollments.OrderBy(e => e.Id)
				.SelectEnrollmentSummaryDTO(_childRepository, _fundingRepository, _siteRepository)
				.ToListAsync();

		}

		public async Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId)
		{
			var enrollment = _context.Enrollments
				.Where(e => e.SiteId == siteId && e.Id == id)
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
				.Include(e => e.Site)
				.Include(e => e.Child)
					.ThenInclude(c => c.Family)
						.ThenInclude(f => f.Determinations)
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
			return await Task.FromResult(_context.Enrollments
				.Where(e => e.SiteId == siteId && e.Id == id)
				.SelectEnrollmentDTO(_childRepository, _fundingRepository, _siteRepository)
				.FirstOrDefault());
		}

		public async Task<List<EnrollmentSummaryDTO>> GetEnrollmentSummaryDTOsForOrganizationAsync(
			int orgId,
			DateTime? from = null,
			DateTime? to = null,
			DateTime? asOf = null,
			int skip = 0,
			int? take = null
		)
		{
			var enrollments =
				(asOf != null ? _context.Enrollments.AsOf((DateTime)asOf) : _context.Enrollments)
				.FilterByDates(from, to)
				.Where(e => e.Site.OrganizationId == orgId)
				.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			return await enrollments
				.SelectEnrollmentSummaryDTO(_childRepository, _fundingRepository, _siteRepository)
				.OrderBy(e => e.Id)
				.ToListAsync();
		}

		public void DeleteEnrollment(Enrollment enrollment)
		{
			_context.Enrollments.Remove(enrollment);
		}
	}

	public interface IEnrollmentRepository : IHedwigRepository
	{
		void UpdateEnrollment(Enrollment enrollment, EnrollmentDTO enrollmentDTO);
		void AddEnrollment(Enrollment enrollment);
		Task<List<Enrollment>> GetEnrollmentsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, int skip = 0, int? take = null);
		Task<List<EnrollmentSummaryDTO>> GetEnrollmentSummaryDTOsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, int skip = 0, int? take = null);
		Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId);
		Task<EnrollmentDTO> GetEnrollmentDTOForSiteAsync(int id, int siteId);
		Task<List<EnrollmentSummaryDTO>> GetEnrollmentSummaryDTOsForOrganizationAsync(int orgId, DateTime? from = null, DateTime? to = null, DateTime? asOf = null, int skip = 0, int? take = null);
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

		public static IQueryable<EnrollmentSummaryDTO> SelectEnrollmentSummaryDTO(
			this IQueryable<Enrollment> query,
			IChildRepository childRepository,
			IFundingRepository fundingRepository,
			ISiteRepository siteRepository
		)
		{
			return query.Select(e => new EnrollmentSummaryDTO()
			{
				Id = e.Id,
				ChildId = e.ChildId,
				Child = childRepository.GetEnrollmentSummaryChildDTOById(e.ChildId),
				SiteId = e.SiteId,
				Site = siteRepository.GetEnrollmentSummarySiteDTOById(e.SiteId),
				AgeGroup = e.AgeGroup,
				Entry = e.Entry,
				Exit = e.Exit,
				ExitReason = e.ExitReason,
				Fundings = fundingRepository.GetFundingDTOsByEnrollmentId(e.Id),
				ValidationErrors = e.ValidationErrors,
			});
		}
		public static IQueryable<EnrollmentDTO> SelectEnrollmentDTO(
			this IQueryable<Enrollment> query,
			IChildRepository childRepository,
			IFundingRepository fundingRepository,
			ISiteRepository siteRepository
		)
		{
			return query.Select(e => new EnrollmentDTO()
			{
				Id = e.Id,
				ChildId = e.ChildId,
				Child = childRepository.GetEnrollmentChildDTOById(e.ChildId),
				SiteId = e.SiteId,
				Site = siteRepository.GetOrganizationSiteDTOById(e.SiteId),
				AgeGroup = e.AgeGroup,
				Entry = e.Entry,
				Exit = e.Exit,
				ExitReason = e.ExitReason,
				Fundings = fundingRepository.GetFundingDTOsByEnrollmentId(e.Id),
				ValidationErrors = e.ValidationErrors,
			});
		}
	}
}
