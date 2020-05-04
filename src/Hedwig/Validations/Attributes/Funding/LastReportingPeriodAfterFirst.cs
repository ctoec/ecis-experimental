using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class LastReportingPeriodAfterFirst : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var funding = validationContext.ObjectInstance as Funding;

			if (funding.LastReportingPeriodId.HasValue)
			{
				if (!funding.FirstReportingPeriodId.HasValue)
				{
					return new ValidationResult("Last reporting period cannot be added without first reporting period");
				}

				var reportingPeriods = validationContext.GetService(typeof(IReportingPeriodRepository)) as IReportingPeriodRepository;
				var firstReportingPeriod = funding.FirstReportingPeriod ?? reportingPeriods.GetById(funding.FirstReportingPeriodId.Value);
				var lastReportingPeriod = funding.LastReportingPeriod ?? reportingPeriods.GetById(funding.LastReportingPeriodId.Value);
				if (lastReportingPeriod.Period < firstReportingPeriod.Period)
				{
					return new ValidationResult("Last reporting period cannot be before first reporting period");
				}
			}

			return null;
		}
	}
}
