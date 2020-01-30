using Hedwig.Models;
using Hedwig.Repositories;
using System;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Utilities;

namespace Hedwig.HostedServices
{
	public class CdcReportGeneratorScopedService
	{
		private readonly IOrganizationRepository _organizations;
		private readonly IReportingPeriodRepository _periods;
		private readonly IReportRepository _reports;
		private readonly IDateTime _dateTime;

		public CdcReportGeneratorScopedService(
			IOrganizationRepository organizations,
			IReportingPeriodRepository periods,
			IReportRepository reports,
			IDateTime dateTime
		)
		{
			_organizations = organizations;
			_periods = periods;
			_reports = reports;
			_dateTime = dateTime;
		}

		public async Task TryGenerateReports()
		{
			var periods = await _periods.GetReportingPeriodsByFundingSourceAsync(FundingSource.CDC);
			var currentReportingPeriod = periods
				.FirstOrDefault(period => period.PeriodEnd.Date == _dateTime.UtcNow.Date);

			if (currentReportingPeriod == null) {
				return;
			}

			var organizations = _organizations.GetOrganizationsWithFundingSpaces(FundingSource.CDC);
			foreach (var organization in organizations)
			{
				var orgId = organization.Id;
				if (!_reports.HasCdcReportForOrganizationAndReportingPeriod(orgId, currentReportingPeriod))
				{
					// New report has not been created
					var previousReport = _reports.GetMostRecentSubmittedCdcReportForOrganization(orgId);
					var report = new CdcReport {
						OrganizationId = organization.Id,
						ReportingPeriod = currentReportingPeriod,
						Accredited = previousReport != null && previousReport.Accredited, 
					};

					_reports.AddReport(report);
				}
			}

			await _reports.SaveChangesAsync();
		}
	}
}