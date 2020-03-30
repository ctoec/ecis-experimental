using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using System;
using System.Collections.Generic;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class CDC_Funding_ReportingPeriodsAreValid : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var enrollment = validationContext.ObjectInstance as Enrollment;
			var fundings = value as ICollection<Funding> ?? new List<Funding> { };
			var reportingPeriods = (IReportingPeriodRepository)validationContext.GetService(typeof(IReportingPeriodRepository));

			foreach (var funding in fundings)
			{
				if (funding.Source != FundingSource.CDC)
				{
					continue;
				}

				var firstReportingPeriod = funding.FirstReportingPeriod ?? (
					funding.FirstReportingPeriodId.HasValue ? reportingPeriods.GetById(funding.FirstReportingPeriodId.Value) : null
				);
				if (enrollment.Entry.HasValue && firstReportingPeriod != null
					&& firstReportingPeriod.PeriodEnd.Date < enrollment.Entry.Value.Date)
				{
					return new ValidationResult("First reporting period for CDC funding must not end before enrollment starts");
				}

				if (enrollment.Exit.HasValue)
				{
					if (!funding.LastReportingPeriodId.HasValue)
					{
						return new ValidationResult("Fundings for ended enrollments must have last reporting periods");
					}

					var lastReportingPeriod = funding.LastReportingPeriod ?? reportingPeriods.GetById(funding.LastReportingPeriodId.Value);
					if (lastReportingPeriod.PeriodStart.Date > enrollment.Exit.Value.Date)
					{
						return new ValidationResult("Last reporting period for CDC funding must start before enrollment ends");
					}
				}
			}

			return null;
		}
	}
}
