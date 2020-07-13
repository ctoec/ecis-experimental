using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Hedwig.Models;
using Hedwig.Models.Extensions;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class FundingTimeUtilizationsWeeksUsedDoNotExceedTotalAvailableWeeks : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var report = validationContext.ObjectInstance as CdcReport;
			var timeSplitUtilizations = value as ICollection<FundingTimeSplitUtilization> ?? new List<FundingTimeSplitUtilization> { };

			var organizations = (IOrganizationRepository)validationContext.GetService(typeof(IOrganizationRepository));
			var organization = organizations.GetOrganizationWithFundingSpaces(report.OrganizationId);
			if (organization == null)
			{
				return null;
			}
			var fundingSpaces = organization.FundingSpaces;

			var reports = (IReportRepository)validationContext.GetService(typeof(IReportRepository));
			var fiscalYearReports = reports.GetReportsForOrganizationByFiscalYear(organization.Id, report.ReportingPeriod.Period);

			foreach (var timeSplitUtilization in timeSplitUtilizations)
			{
				var fundingSpace = fundingSpaces.FirstOrDefault(f => f.Id == timeSplitUtilization.FundingSpaceId);
				if (fundingSpace != null)
				{
					var fiscalYearUsedWeeks = fiscalYearReports.GetWeeksUsedForFundingSpace(fundingSpace);
					var timeSplit = fundingSpace.TimeSplit;
					var lesserTime = timeSplit.LesserTime();
					var lesserWeeks = timeSplitUtilization.WeeksUsedForFundingTime(lesserTime);
					var maxWeeks = timeSplit.LesserTimeWeeksAvailable();

					if (fiscalYearUsedWeeks + lesserWeeks > maxWeeks)
					{
						return new ValidationResult("Number of weeks used in this reporting period cannot exceed the number of weeks available.");
					}
				}
			}

			return null;
		}
	}
}
