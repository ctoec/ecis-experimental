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
		public EnrollmentRepository(HedwigContext context) : base(context) { }

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

		public Task<List<Enrollment>> GetEnrollmentsForSiteAsync(
			int siteId,
			DateTime? from = null,
			DateTime? to = null,
			int skip = 0,
			int? take = null
		)
		{
			var enrollments = _context.Enrollments
				.FilterByDates(from, to)
				.Where(e => e.SiteId == siteId);

			enrollments = enrollments.IncludeFundingsSitesAndChild();

			enrollments = enrollments.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			return enrollments.OrderBy(e => e.Id).ToListAsync();
		}

		public Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId)
		{
			var enrollmentQuery = _context.Enrollments
				.Where(e => e.SiteId == siteId && e.Id == id);

			enrollmentQuery = enrollmentQuery.Include(e => e.Author);
			enrollmentQuery = enrollmentQuery.IncludeFundingsSitesAndChild();
			enrollmentQuery = enrollmentQuery.IncludeFamilyAndDeterminations();

			var enrollment = enrollmentQuery.FirstOrDefault();

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

			return Task.FromResult(enrollment);
		}

		public async Task<List<Enrollment>> GetEnrollmentsForOrganizationAsync(
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
				.Where(e => e.Site.OrganizationId == orgId);

			enrollments = enrollments.IncludeFundingsSitesAndChild();

			enrollments = enrollments.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			return await enrollments.OrderBy(e => e.Id).ToListAsync();
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
		Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId);
		Task<List<Enrollment>> GetEnrollmentsForOrganizationAsync(int orgId, DateTime? from = null, DateTime? to = null, DateTime? asOf = null, int skip = 0, int? take = null);
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

		public static IQueryable<Enrollment> IncludeFundingsSitesAndChild(this IQueryable<Enrollment> query)
		{
			query = query.Include(e => e.Fundings)
					.ThenInclude(f => f.FundingSpace)
						.ThenInclude(fs => fs.TimeSplit)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FirstReportingPeriod)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.LastReportingPeriod)
				.Include(e => e.Child)
					.ThenInclude(c => c.C4KCertificates);

			query = query.Include(e => e.Site);

			query = query.Include(e => e.Child);


			return query;
		}

		public static IQueryable<Enrollment> IncludeFamilyAndDeterminations(this IQueryable<Enrollment> query)
		{
			query = ((IIncludableQueryable<Enrollment, Child>)query).ThenInclude(c => c.Family);

			query = ((IIncludableQueryable<Enrollment, Family>)query).ThenInclude(f => f.Determinations);

			return query;
		}
	}
}
