using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class ReportRepository : IReportRepository
	{
		private readonly HedwigContext _context;

		public ReportRepository(HedwigContext context) => _context = context;

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

		public Task<Report> GetReportByIdAsync(int id) => _context.Reports
			.Include(r => r.ReportingPeriod)
			.FirstOrDefaultAsync(r => r.Id == id);

		public Report UpdateReport(Report report)
		{
			_context.SaveChanges();
			return report;
		}
	}

	public interface IReportRepository
	{
		Task<IEnumerable<Report>> GetReportsByUserIdAsync(int userId);
		Task<Report> GetReportByIdAsync(int id);
		Report UpdateReport(Report report);
	}
}
