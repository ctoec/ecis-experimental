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

    public async Task<IEnumerable<Report>> GetReportsByUserIdAsync(int userId)
    {
      var permissions = _context.Permissions.Where(p => userId == p.UserId);

      var organizationPermissions = permissions
        .OfType<OrganizationPermission>()
        .Include(p => p.Organization)
          .ThenInclude(o => o.Reports)
            .ThenInclude(r => r.ReportingPeriod)
        .ToListAsync();

      // var sitePermissions = permissions
      // 	.OfType<SitePermission>()
      // 	.Include(p => p.Site)
      // 		.ThenInclude(o => o.Reports)
      //      .ThenInclude(r => r.ReportingPeriod)
      // 	.ToListAsync();

      await organizationPermissions;
      // await Task.WhenAll(sitePermissions, organizationPermissions);

      var reports = organizationPermissions.Result.SelectMany(p => p.Organization.Reports as IEnumerable<Report>);
      // .Concat(sitePermissions.Result.SelectMany(p => p.Site.Reports));

      return reports;
    }

    public Task<List<Report>> GetReportsForOrganization(int orgId)
    {
      return _context.Reports
        .OfType<OrganizationReport>()
        .Where(r => r.OrganizationId == orgId)
        .Select(r => r as Report)
        .ToListAsync();
    }

    public async Task<Report> GetReportByIdAsync(int id) => await _context.Reports
      .Include(r => r.ReportingPeriod)
      .FirstOrDefaultAsync(r => r.Id == id);

    public async Task<Report> GetReportForOrganizationAsync(int id, int orgId, string[] include = null)
    {
      var include_orgs = include.Contains(INCLUDE_ORGANIZATIONS);
      var include_sites = include.Contains(INCLUDE_SITES);
      var include_funding_spaces = include.Contains(INCLUDE_FUNDING_SPACES);

      var report = _context.Reports
        .OfType<OrganizationReport>()
        .Where(r => r.Id == id && r.OrganizationId == orgId);

      if (include_orgs)
      {
        report = report.Include(report => report.Organization);
      }

      if (include_sites)
      {
        report = report
          .Include(report => report.Organization)
          .ThenInclude(organization => organization.Sites);
      }

      if (include_funding_spaces)
      {
        report = report
          .Include(report => report.Organization)
          .ThenInclude(organization => organization.FundingSpaces);
      }

      return await report.FirstOrDefaultAsync() as Report;
    }
  }

  public interface IReportRepository
  {
    Task<IEnumerable<Report>> GetReportsByUserIdAsync(int userId);
    Task<List<Report>> GetReportsForOrganization(int orgId);
    Task<Report> GetReportByIdAsync(int id);
    Task<Report> GetReportForOrganizationAsync(int id, int orgId, string[] include);
  }
}
