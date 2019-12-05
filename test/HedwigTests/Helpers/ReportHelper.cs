using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
  public class ReportHelper
  {
    public static Report CreateCdcReport(
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

      context.Reports.Add(report);
      context.SaveChanges();
      return report;
    }
  }
}
