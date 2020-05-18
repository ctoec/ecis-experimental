using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Models.Extensions;

namespace Hedwig.Validations.Attributes
{
	public class FundingTimeUtilizationsWeeksUsedAreLessThanReportingPeriodWeeks : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var report = validationContext.ObjectInstance as CdcReport;
			var timeSplitUtilizations = value as ICollection<FundingTimeSplitUtilization> ?? new List<FundingTimeSplitUtilization> { };

			var organizations = (IOrganizationRepository)validationContext.GetService(typeof(IOrganizationRepository));
			var organization = organizations.GetOrganizationById(report.OrganizationId, new string[] { "funding_spaces" });
			var fundingSpaces = organization.FundingSpaces;

			foreach (var timeSplitUtilization in timeSplitUtilizations)
			{
				var fundingSpace = fundingSpaces.FirstOrDefault(f => f.Id == timeSplitUtilization.FundingSpaceId);
				if (fundingSpace != null)
				{
					var timeSplit = fundingSpace.TimeSplit;
					var lesserTime = timeSplit.LesserTime();
					var lesserWeeks = timeSplitUtilization.WeeksUsedForFundingTime(lesserTime);
					var reportWeeks = report.ReportingPeriod.NumberOfWeeks();

					if (lesserWeeks > reportWeeks)
					{
						return new ValidationResult("Number of weeks used in this reporting period cannot exceed the total number of weeks in this reporting period.");
					}
				}
			}

			return null;
		}
	}
}
