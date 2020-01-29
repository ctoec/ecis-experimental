using Hedwig.Models;
using Hedwig.Repositories;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace Hedwig.HostedServices
{
	class CdcReportGeneratorScopedService
	{
		private readonly IOrganizationRepository _organizations;
		private readonly IReportingPeriodRepository _periods;
		private readonly IReportRepository _reports;

		public CdcReportGeneratorScopedService(
			IOrganizationRepository organizations,
			IReportingPeriodRepository periods,
			IReportRepository reports
		)
		{
			_organizations = organizations;
			_periods = periods;
			_reports = reports;
		}

		public async Task DoWork()
		{
			var periods = await _periods.GetReportingPeriodsByFundingSourceAsync(FundingSource.CDC);
			var currentReportingPeriod = periods
				.FirstOrDefault(period => period.PeriodEnd.Date == DateTime.UtcNow.Date);

			if (currentReportingPeriod == null) {
				return;
			}

			var organizations = _organizations.GetOrganizationsWithFundingSpaces(FundingSource.CDC);
			foreach (var organization in organizations)
			{
				var previousReport = _reports.GetMostRecentSubmittedCdcReportForOrganization(organization.Id);
				var report = new CdcReport {
					OrganizationId = organization.Id,
					ReportingPeriod = currentReportingPeriod,
					Accredited = previousReport != null && previousReport.Accredited, 
				};

				_reports.AddReport(report);
			}

			await _reports.SaveChangesAsync();
		}
	}
}