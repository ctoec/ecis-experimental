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
			if (funding.FirstReportingPeriodId == null)
			{
				return null;
			}
			var currentEnrollment = funding.Enrollment ?? _enrollments.GetEnrollmentByIdAsNoTracking(funding.EnrollmentId);
			var childId = currentEnrollment.ChildId;
			var otherCdcFundings = _fundings.GetFundingsByChildIdAsNoTracking(childId).Where(f => f.Source == FundingSource.CDC).Where(f => f.Id != funding.Id);
			var sortedFundings = otherCdcFundings.OrderBy(f => f.FirstReportingPeriod.PeriodStart);

			if (sortedFundings.Count() == 0)
			{
				return null;
			}

			var firstReportingPeriod = funding.FirstReportingPeriod.PeriodStart;
			DateTime? lastReportingPeriod = null;
			if (funding.LastReportingPeriod != null)
			{
				lastReportingPeriod = funding.LastReportingPeriod.PeriodEnd;
			}

			var doesOverlap = false;
			foreach (var currentFunding in sortedFundings)
			{
				if (doesOverlap)
				{
					break;
				}
				var currentFirstReportingPeriodStart = currentFunding.FirstReportingPeriod.PeriodStart;
				if (currentFirstReportingPeriodStart == firstReportingPeriod)
				{
					doesOverlap = true;
				}
				else if (currentFirstReportingPeriodStart < firstReportingPeriod)
				{
					if (currentFunding.LastReportingPeriod == null)
					{
						doesOverlap = true;
					}
					else
					{
						var currentLastReportingPeriodEnd = currentFunding.LastReportingPeriod.PeriodEnd;
						if (firstReportingPeriod <= currentLastReportingPeriodEnd)
						{
							doesOverlap = true;
						}
					}
				}
				else /* (firstReportingPeriod < currentFirstReportingPeriodStart) */
				{
					if (lastReportingPeriod == null)
					{
						doesOverlap = true;
					}
					else
					{
						if (currentFirstReportingPeriodStart <= lastReportingPeriod)
						{
							doesOverlap = true;
						}
					}
				}
			}

			if (doesOverlap)
			{
				return new ValidationError(
					message: "Cannot claim a child twice in a reporting period",
					isSubObjectValidation: false,
					field: "FirstReportingPeriod"
				);
			}

			return null;
		}
	}
}
