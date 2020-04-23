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
		readonly IReportingPeriodRepository _reportingPeriods;

		public FundingTimelinesAreValid(
			IFundingRepository fundings,
			IEnrollmentRepository enrollments,
			IReportingPeriodRepository reportingPeriods
		)
		{
			_fundings = fundings;
			_enrollments = enrollments;
			_reportingPeriods = reportingPeriods;
		}

		public ValidationError Execute(Funding funding, NonBlockingValidationContext context)
		{
			if (!funding.FirstReportingPeriodId.HasValue)
			{
				return null;
			}
			var currentEnrollment = funding.Enrollment ?? _enrollments.GetEnrollmentById(funding.EnrollmentId);
			var childId = currentEnrollment.ChildId;
			var otherCdcFundings = _fundings.GetFundingsByChildId(childId).Where(f => f.Source == FundingSource.CDC).Where(f => f.Id != funding.Id);
			var sortedFundings = otherCdcFundings.OrderBy(f => f.FirstReportingPeriod.PeriodStart);

			if (sortedFundings.Count() == 0)
			{
				return null;
			}

			var firstReportingPeriodStart = funding.FirstReportingPeriod != null
				? funding.FirstReportingPeriod.PeriodStart
				: _reportingPeriods.GetById(funding.FirstReportingPeriodId.Value).PeriodStart;

			DateTime? lastReportingPeriodEnd = null;
			if (funding.LastReportingPeriodId.HasValue)
			{
				lastReportingPeriodEnd = funding.LastReportingPeriod != null
					? funding.LastReportingPeriod.PeriodEnd
					: _reportingPeriods.GetById(funding.LastReportingPeriodId.Value).PeriodEnd;
			}

			var doesOverlap = false;
			foreach (var currentFunding in sortedFundings)
			{
				if (doesOverlap)
				{
					break;
				}
				var currentFirstReportingPeriodStart = currentFunding.FirstReportingPeriod.PeriodStart;
				if (currentFirstReportingPeriodStart == firstReportingPeriodStart)
				{
					doesOverlap = true;
				}
				else if (currentFirstReportingPeriodStart < firstReportingPeriodStart)
				{
					if (currentFunding.LastReportingPeriod == null)
					{
						doesOverlap = true;
					}
					else
					{
						var currentLastReportingPeriodEnd = currentFunding.LastReportingPeriod.PeriodEnd;
						if (firstReportingPeriodStart <= currentLastReportingPeriodEnd)
						{
							doesOverlap = true;
						}
					}
				}
				else /* (firstReportingPeriod < currentFirstReportingPeriodStart) */
				{
					if (lastReportingPeriodEnd == null)
					{
						doesOverlap = true;
					}
					else
					{
						if (currentFirstReportingPeriodStart <= lastReportingPeriodEnd)
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
