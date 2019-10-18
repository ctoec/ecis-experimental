using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class ReportHelper
	{
		public static CdcReport CreateCdcReport(
			HedwigContext context,
			ReportingPeriod reportingPeriod = null,
			Organization organization = null,
			string submittedAt = null
		)
		{
			var report = CreateCdcReportObject(context, reportingPeriod, organization, submittedAt);
			context.Reports.Add(report);
			context.SaveChanges();
			return report;
		}

		public static CdcReport CreateCdcReportObject(
			HedwigContext context,
			ReportingPeriod reportingPeriod = null,
			Organization organization = null,
			string submittedAt = null
		)
		{
			reportingPeriod = reportingPeriod ?? ReportingPeriodHelper.CreatePeriod(context, type: FundingSource.CDC);
			organization = organization ?? OrganizationHelper.CreateOrganization(context);

			var report = new CdcReport
			{
				ReportingPeriodId = reportingPeriod.Id,
				OrganizationId = organization.Id
			};

			if (submittedAt != null) report.SubmittedAt = DateTime.Parse(submittedAt);
			return report;
		}
	}
}
