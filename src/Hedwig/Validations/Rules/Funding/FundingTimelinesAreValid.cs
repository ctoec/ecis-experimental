using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;
using System;
using System.Collections.Generic;

namespace Hedwig.Validations.Rules
{
	public class FundingTimelinesAreValid : IValidationRule<Funding>
	{
		readonly IFundingRepository _fundings;
		readonly IEnrollmentRepository _enrollments;

		public FundingTimelinesAreValid(
			IFundingRepository fundings,
			IEnrollmentRepository enrollments
		)
		{
			_fundings = fundings;
			_enrollments = enrollments;
		}

		public ValidationError Execute(Funding funding, NonBlockingValidationContext context)
		{
			var currentEnrollment = funding.Enrollment ?? _enrollments.GetEnrollmentById(funding.EnrollmentId);
			var childId = currentEnrollment.ChildId;
			var childFundings = _fundings.GetFundingsByChildId(childId);
			var sortedFundings = childFundings.TakeWhile(f => f.FirstReportingPeriod != null).OrderBy(f => f.FirstReportingPeriod.PeriodStart);

			if (sortedFundings.Count() == 0)
			{
				return null;
			}

			var currentFunding = sortedFundings.FirstOrDefault();
			DateTime? currentEndReportingPeriod = null;
			if (currentFunding.LastReportingPeriod != null)
			{
				currentEndReportingPeriod = currentFunding.LastReportingPeriod.PeriodStart;
			}
			var isValid = true;
			foreach (var iFunding in sortedFundings.Skip(1))
			{
				var nextReportingPeriod = iFunding.FirstReportingPeriod;
				if (currentEndReportingPeriod == null)
				{
					isValid = false;
				}
				else
				{
					if (nextReportingPeriod != null)
					{
						var nextStartReportingPeriod = nextReportingPeriod.PeriodStart;
						isValid = isValid && currentEndReportingPeriod < nextStartReportingPeriod;
					}
				}
				currentEndReportingPeriod = nextReportingPeriod.PeriodEnd;
			}

			if (!isValid)
			{
				return new ValidationError(
					message: "Funding reporting periods cannot overlap",
					isSubObjectValidation: false,
					field: "FirstReportingPeriod"
				);
			}

			return null;
		}
	}
}
