using Hedwig.Models;
using Hedwig.Repositories;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System;
using Hedwig.Utilities.DateTime;

namespace Hedwig.HostedServices
{
	public class CdcReportGeneratorScopedService
	{

		private readonly ILogger<CdcReportGeneratorScopedService> _logger;
		private readonly IOrganizationRepository _organizations;
		private readonly IReportingPeriodRepository _periods;
		private readonly IReportRepository _reports;
		private readonly IDateTime _dateTime;

		public CdcReportGeneratorScopedService(
			ILogger<CdcReportGeneratorScopedService> logger,
			IOrganizationRepository organizations,
			IReportingPeriodRepository periods,
			IReportRepository reports,
			IDateTime dateTime
		)
		{
			_logger = logger;
			_organizations = organizations;
			_periods = periods;
			_reports = reports;
			_dateTime = dateTime;
		}

		public async Task TryGenerateReports()
		{
			_logger.LogInformation("Starting CDC report generation task");
			try
			{
				var lastReportingPeriod = _periods.GetLastReportingPeriodBeforeDate(FundingSource.CDC, _dateTime.UtcNow.Date);

				var createdReportsCount = 0;
				var organizations = _organizations.GetOrganizationsWithFundingSpaces(FundingSource.CDC);
				foreach (var organization in organizations)
				{
					// If report has not been created for last reporting period, create it
					if (!_reports.HasCdcReportForOrganizationAndReportingPeriod(organization.Id, lastReportingPeriod))
					{
						var previousReport = _reports.GetMostRecentSubmittedCdcReportForOrganization(organization.Id);
						var report = new CdcReport
						{
							OrganizationId = organization.Id,
							ReportingPeriodId = lastReportingPeriod.Id,
							Accredited = previousReport != null && previousReport.Accredited,
						};

						_reports.AddReport(report);
						createdReportsCount += 1;
					}
				}

				await _reports.SaveChangesAsync();
				_logger.LogInformation($"Successfully created {createdReportsCount} reports for reporting period {lastReportingPeriod.Period.Date}");
			}
			catch (Exception e)
			{
				// TODO: figure out how to alert on this when alerting exists
				_logger.LogError($"Unable to create reports", e);
			}
		}
	}
}
