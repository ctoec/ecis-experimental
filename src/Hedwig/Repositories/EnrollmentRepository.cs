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

		public Enrollment GetEnrollmentByIdAsNoTracking(int id)
		{
			return _context.Enrollments.AsNoTracking().SingleOrDefault(e => e.Id == id);
		}

		public void UpdateEnrollment(Enrollment enrollment)
		{
			var currentFundings = _context.Fundings.AsNoTracking().Where(f => f.EnrollmentId == enrollment.Id).ToList();
			var newFundings = enrollment.Fundings.AsEnumerable().Cast<IHedwigIdEntity<int>>();
			var oldFundings = currentFundings.AsEnumerable().Cast<IHedwigIdEntity<int>>();
			UpdateEnumerableChildObjects(newFundings, oldFundings);

			var currentC4kCertificates = _context.C4KCertificates.AsNoTracking().Where(c => c.ChildId == enrollment.ChildId).ToList();
			var newC4kCertificatesRaw = enrollment.Child.C4KCertificates != null ? enrollment.Child.C4KCertificates : new List<C4KCertificate> { };
			var newC4kCertificates = newC4kCertificatesRaw.AsEnumerable().Cast<IHedwigIdEntity<int>>();
			var oldC4kCertificates = currentC4kCertificates.AsEnumerable().Cast<IHedwigIdEntity<int>>();
			UpdateEnumerableChildObjects(newC4kCertificates, oldC4kCertificates);

			_context.Update(enrollment);
		}

		public void AddEnrollment(Enrollment enrollment)
		{
			_context.Add(enrollment);
		}

		public Task<List<Enrollment>> GetEnrollmentsForSiteAsync(
			int siteId,
			DateTime? from = null,
			DateTime? to = null,
			string[] include = null,
			int skip = 0,
			int? take = null
		)
		{
			var enrollments = _context.Enrollments
				.FilterByDates(from, to)
				.Where(e => e.SiteId == siteId);

			enrollments = enrollments.ProcessInclude(include);

			enrollments = enrollments.Skip(skip);
			if (take.HasValue)
			{
				enrollments = enrollments.Take(take.Value);
			}
			return enrollments.OrderBy(e => e.Id).ToListAsync();
		}

		public Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId, string[] include)
		{
			var enrollmentQuery = _context.Enrollments
				.Where(e => e.SiteId == siteId && e.Id == id);

			enrollmentQuery = enrollmentQuery.Include(e => e.Author);
			enrollmentQuery = enrollmentQuery.ProcessInclude(include);

			var enrollment = enrollmentQuery.FirstOrDefault();

			// handle special include of un-mapped properties
			if (enrollment != null
			&& include.Contains(HedwigRepository.INCLUDE_PAST_ENROLLMENTS))
			{
				var pastEnrollments = _context.Enrollments.Where(
					e => e.ChildId == enrollment.ChildId
					// TODO: Add validations for multiple enrollments (cannot overlap, only one enrollment without entry/exit)
					&& e.Entry.HasValue
					&& e.Entry < enrollment.Entry
				)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FundingSpace)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.FirstReportingPeriod)
				.Include(e => e.Fundings)
					.ThenInclude(f => f.LastReportingPeriod)
				.ToList();

				enrollment.PastEnrollments = pastEnrollments;
			}

			return Task.FromResult(enrollment);
		}

		public async Task<List<Enrollment>> GetEnrollmentsForOrganizationAsync(
			int orgId,
			DateTime? from = null,
			DateTime? to = null,
			string[] include = null,
			DateTime? asOf = null,
			int skip = 0,
			int? take = null
		)
		{
			var enrollments =
				(asOf != null ? _context.Enrollments.AsOf((DateTime)asOf) : _context.Enrollments)
				.FilterByDates(from, to)
				.Where(e => e.Site.OrganizationId == orgId);

			enrollments = enrollments.ProcessInclude(include);

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
		void UpdateEnrollment(Enrollment enrollment);
		void AddEnrollment(Enrollment enrollment);
		Task<List<Enrollment>> GetEnrollmentsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, string[] include = null, int skip = 0, int? take = null);
		Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId, string[] include = null);
		Task<List<Enrollment>> GetEnrollmentsForOrganizationAsync(int orgId, DateTime? from = null, DateTime? to = null, string[] include = null, DateTime? asOf = null, int skip = 0, int? take = null);
		Enrollment GetEnrollmentByIdAsNoTracking(int id);

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

		public static IQueryable<Enrollment> ProcessInclude(this IQueryable<Enrollment> query, string[] include = null)
		{
			include = include ?? new string[] { };
			if (include.Contains(HedwigRepository.INCLUDE_SITES))
			{
				query = query.Include(e => e.Site);
			}

			if (include.Contains(HedwigRepository.INCLUDE_FUNDINGS))
			{
				query = query.Include(e => e.Fundings)
						.ThenInclude(f => f.FundingSpace)
							.ThenInclude(fs => fs.FundingTimeAllocations)
					.Include(e => e.Fundings)
						.ThenInclude(f => f.FirstReportingPeriod)
					.Include(e => e.Fundings)
						.ThenInclude(f => f.LastReportingPeriod)
					.Include(e => e.Child)
						.ThenInclude(c => c.C4KCertificates);
			}

			if (include.Contains(HedwigRepository.INCLUDE_CHILD))
			{
				query = query.Include(e => e.Child);

				if (include.Contains(HedwigRepository.INCLUDE_FAMILY))
				{
					query = ((IIncludableQueryable<Enrollment, Child>)query).ThenInclude(c => c.Family);

					if (include.Contains(HedwigRepository.INCLUDE_DETERMINATIONS))
					{
						query = ((IIncludableQueryable<Enrollment, Family>)query).ThenInclude(f => f.Determinations);
					}
				}
			}

			return query;
		}
	}
}
