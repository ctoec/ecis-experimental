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
  public class ReportRepository : HedwigRepository, IReportRepository
  {
    public ReportRepository(HedwigContext context) : base(context) { }

    public void UpdateReport(Report report)
    {
      // Should this be _context.Update(report) as in EnrollmentRepository ?
      // depends on if we include sub-objets on report that should _not_ be updated
      _context.Entry(report).State = EntityState.Modified;
    }

    public Task<List<CdcReport>> GetReportsForOrganizationAsync(int orgId)
    {
      return _context.Reports
        .OfType<OrganizationReport>()
        .Where(r => r.OrganizationId == orgId)
        .Include(report => report.ReportingPeriod)
        .Select(r => r as CdcReport)
        .ToListAsync();
    }

    public async Task<CdcReport> GetReportForOrganizationAsync(int id, int orgId, string[] include = null)
    {
      include = include ?? new string[] { };
      var include_orgs = include.Contains(INCLUDE_ORGANIZATIONS);
      var include_sites = include.Contains(INCLUDE_SITES);
      var include_enrollments = include.Contains(INCLUDE_ENROLLMENTS);
      var include_children = include.Contains(INCLUDE_CHILD);
      var include_funding_spaces = include.Contains(INCLUDE_FUNDING_SPACES);

      IQueryable<CdcReport> reportQuery = _context.Reports
        .OfType<CdcReport>()
        .AsNoTracking() // Disable tracking as these read-only queries should not be saved back to the DB
        .Where(report => report.Id == id && report.OrganizationId == orgId)
        .Include(report => report.ReportingPeriod);

      if (include.Contains(INCLUDE_ORGANIZATIONS))
      {
        reportQuery = reportQuery.Include(report => report.Organization);
      }

      // To enable later manual inclusion of enrollments/children, include sites now
      if (include.Contains(INCLUDE_SITES) || include.Contains(INCLUDE_ENROLLMENTS) || include.Contains(INCLUDE_CHILD))
      {
        reportQuery = reportQuery
          .Include(report => report.Organization)
          .ThenInclude(organization => organization.Sites);
      }

      if (include.Contains(INCLUDE_FUNDING_SPACES))
      {
        reportQuery = reportQuery
          .Include(report => report.Organization)
          .ThenInclude(organization => organization.FundingSpaces);
      }

      var reportResult = await reportQuery.FirstOrDefaultAsync();

      // Optionally manually insert time-versioned enrollment records
      if (include.Contains(INCLUDE_ENROLLMENTS) || include.Contains(INCLUDE_CHILD))
      {
        var asOf = reportResult.SubmittedAt;
        var sites = reportResult.Organization.Sites.ToList();
        var siteIds = sites.Select(site => site.Id);

        // Potential optimization to fetch only the enrollments that are funded during the reporting period
        var enrollments = await (asOf.HasValue ? _context.Enrollments.AsOf(asOf.Value) : _context.Enrollments)
          .AsNoTracking()
          .Where(enrollment => siteIds.Contains(enrollment.SiteId))
          .ToListAsync();

        var enrollmentIds = enrollments.Select(enrollment => enrollment.Id);
        var fundings = await (asOf.HasValue ? _context.Fundings.AsOf(asOf.Value) : _context.Fundings)
          .AsNoTracking()
          .Where(funding => enrollmentIds.Contains(funding.EnrollmentId))
          .Where(funding => funding.FirstReportingPeriod.PeriodStart <= reportResult.ReportingPeriod.PeriodStart)
          .Where(funding => funding.LastReportingPeriod == null || funding.LastReportingPeriod.PeriodEnd >= reportResult.ReportingPeriod.PeriodEnd)
          .ToListAsync();

        // Add fundings to enrollments
        enrollments.ForEach(enrollment =>
        {
          enrollment.Fundings = fundings.Where(funding => funding.EnrollmentId == enrollment.Id).ToList() as ICollection<Funding>;
        });

        // Filter for funded enrollments (only funded enrollments are included in report)
        enrollments = enrollments.Where(enrollment => enrollment.Fundings.Any(funding => funding.Source == reportResult.Type)).ToList();

        // Optionally manually insert time-versioned child records
        if (include.Contains(INCLUDE_CHILD))
        {
          var childIds = enrollments.Select(enrollment => enrollment.ChildId);
          var children = await (asOf.HasValue ? _context.Children.AsOf(asOf.Value) : _context.Children)
            .AsNoTracking()
            .Where(child => childIds.Contains(child.Id))
            .ToDictionaryAsync(child => child.Id);

          // Add children to enrollments
          enrollments.ForEach(enrollment =>
          {
            enrollment.Child = children[enrollment.ChildId];
          });
        }

        // Add enrollments to sites
        sites.ForEach(site =>
        {
          site.Enrollments = enrollments.Where(enrollment => enrollment.SiteId == site.Id).ToList();
        });
      }

      return reportResult;
    }
  }

  public interface IReportRepository : IHedwigRepository
  {
    void UpdateReport(Report report);
    Task<List<CdcReport>> GetReportsForOrganizationAsync(int orgId);
    Task<CdcReport> GetReportForOrganizationAsync(int id, int orgId, string[] include);
  }
}
