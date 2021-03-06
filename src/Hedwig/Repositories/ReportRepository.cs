using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
	public class ReportRepository : HedwigRepository, IReportRepository
	{
		public ReportRepository(HedwigContext context) : base(context) { }

		public void UpdateReport(CdcReport report, CdcReportDTO reportDTO)
		{
			UpdateHedwigIdEntityWithNavigationProperties<CdcReport, CdcReportDTO, int>(report, reportDTO);
		}
		public List<CdcReport> GetReportsForOrganization(int orgId)
		{
			return _context.Reports
			.OfType<CdcReport>()
			.Where(r => r.OrganizationId == orgId)
			.Include(report => report.ReportingPeriod)
			.Include(report => report.Organization)
			.ToList();
		}

		public CdcReport GetCdcReportForOrganization(int id, int orgId)
		{
			IQueryable<CdcReport> reportQuery = _context.Reports
			.OfType<CdcReport>()
			.Where(report => report.Id == id && report.OrganizationId == orgId)
			.Include(report => report.ReportingPeriod)
			.Include(report => report.TimeSplitUtilizations);

			reportQuery = reportQuery.Include(report => report.Organization);

			reportQuery = reportQuery
				.Include(report => report.Organization)
				.ThenInclude(organization => organization.Sites);

			reportQuery = reportQuery
				.Include(report => report.Organization)
					.ThenInclude(organization => organization.FundingSpaces)
						.ThenInclude(fundingSpace => fundingSpace.TimeSplit);

			var reportResult = reportQuery.FirstOrDefault();

			// Manually insert time-versioned enrollment records
			if (reportResult != null)
			{
				var enrollments = GetEnrollmentsForReport(reportResult);
				// Manually insert time-versioned child records
				var childIds = enrollments.Select(enrollment => enrollment.ChildId);
				var children = (reportResult.SubmittedAt.HasValue ? _context.Children.AsOf(reportResult.SubmittedAt.Value) : _context.Children)
					.Include(child => child.C4KCertificates)
					.Include(child => child.Family)
						.ThenInclude(family => family.Determinations)
					.Where(child => childIds.Contains(child.Id))
					.ToDictionary(child => child.Id);

				// Add children to enrollments
				enrollments.ForEach(enrollment =>
				{
					enrollment.Child = children[enrollment.ChildId];
				});

				// Add enrollments to report
				reportResult.Enrollments = enrollments;
			}

			return reportResult;
		}

		public List<Enrollment> GetEnrollmentsForReport(CdcReport report)
		{
			var sites = report.Organization != null && report.Organization.Sites != null
			? report.Organization.Sites.ToList()
			: _context.Sites.Where(s => s.OrganizationId == report.OrganizationId).ToList();
			var siteIds = sites.Select(site => site.Id);

			// Potential optimization to fetch only the enrollments that are funded during the reporting period
			var enrollments = (report.SubmittedAt.HasValue ? _context.Enrollments.AsOf(report.SubmittedAt.Value) : _context.Enrollments)
			.Where(enrollment => siteIds.Contains(enrollment.SiteId))
			.ToList();

			var enrollmentIds = enrollments.Select(enrollment => enrollment.Id);
			var fundings = (report.SubmittedAt.HasValue ? _context.Fundings.AsOf(report.SubmittedAt.Value) : _context.Fundings)
			.Include(funding => funding.FirstReportingPeriod)
			.Include(funding => funding.LastReportingPeriod)
			.Include(funding => funding.FundingSpace)
				.ThenInclude(fundingSpace => fundingSpace.TimeSplit)
			.Where(funding => enrollmentIds.Contains(funding.EnrollmentId))
			.Where(funding => funding.FirstReportingPeriod.PeriodStart <= report.ReportingPeriod.PeriodStart)
			.Where(funding => funding.LastReportingPeriod == null || funding.LastReportingPeriod.PeriodEnd >= report.ReportingPeriod.PeriodEnd)
			.ToList();

			// Add fundings to enrollments
			enrollments.ForEach(enrollment =>
			{
				enrollment.Fundings = fundings.Where(funding => funding.EnrollmentId == enrollment.Id).ToList();
			});

			// Filter for funded enrollments (only funded enrollments are included in report)
			return enrollments.Where(enrollment => enrollment.Fundings.Any(funding => funding.Source == report.Type)).ToList();
		}

		public CdcReport GetMostRecentSubmittedCdcReportForOrganization(int orgId)
		{
			return _context.Reports
			.OfType<CdcReport>()
			.Include(report => report.ReportingPeriod)
			.Where(report => report.SubmittedAt != null)
			.Where(report => report.OrganizationId == orgId)
			.OrderByDescending(report => report.ReportingPeriod.Period)
			.FirstOrDefault();
		}

		public IEnumerable<CdcReport> GetReportsForOrganizationByFiscalYear(int orgId, DateTime periodDate)
		{
			var month = periodDate.Month;
			var fiscalYearStart = periodDate.Year;
			if (month < 7)
			{
				--fiscalYearStart;
			}
			var start = new DateTime(fiscalYearStart, 7, 1);
			var end = new DateTime(fiscalYearStart + 1, 6, 30);
			return _context
				.Reports
				.OfType<CdcReport>()
				.Where(r => r.OrganizationId == orgId)
				.Include(r => r.TimeSplitUtilizations)
				.ThenInclude(u => u.FundingSpace)
				.ThenInclude(f => f.TimeSplit)
				.Include(r => r.ReportingPeriod)
				.Where(
					report =>
						report.ReportingPeriod.Period.CompareTo(start) >= 0 &&
						report.ReportingPeriod.Period.CompareTo(end) <= 0
				)
				.ToList();
		}

		public void AddReport(Report report)
		{
			_context.Add(report);
		}

		public bool HasCdcReportForOrganizationAndReportingPeriod(int orgId, ReportingPeriod period)
		{
			return _context.Reports
			.OfType<CdcReport>()
			.Where(report => report.OrganizationId == orgId)
			.Where(report => report.ReportingPeriodId == period.Id)
			.FirstOrDefault() != null;
		}
	}

	public interface IReportRepository : IHedwigRepository
	{
		void UpdateReport(CdcReport report, CdcReportDTO reportDTO);
		List<CdcReport> GetReportsForOrganization(int orgId);
		CdcReport GetCdcReportForOrganization(int id, int orgId);
		List<Enrollment> GetEnrollmentsForReport(CdcReport report);
		CdcReport GetMostRecentSubmittedCdcReportForOrganization(int orgId);
		IEnumerable<CdcReport> GetReportsForOrganizationByFiscalYear(int orgId, DateTime periodDate);
		void AddReport(Report report);
		bool HasCdcReportForOrganizationAndReportingPeriod(int orgId, ReportingPeriod period);
	}
}
