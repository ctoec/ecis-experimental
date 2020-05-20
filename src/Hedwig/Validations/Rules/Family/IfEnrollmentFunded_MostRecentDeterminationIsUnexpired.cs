using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;
using System;

namespace Hedwig.Validations.Rules
{
	public class IfEnrollmentFunded_MostRecentDeterminationIsUnexpired : IValidationRule<Family>
	{
		private readonly IFamilyDeterminationRepository _determinations;
		private readonly IFundingRepository _fundings;
		private readonly IReportingPeriodRepository _reportingPeriods;
		public IfEnrollmentFunded_MostRecentDeterminationIsUnexpired(
			IFamilyDeterminationRepository determinations,
			IFundingRepository fundings,
			IReportingPeriodRepository reportingPeriods
		)
		{
			_determinations = determinations;
			_fundings = fundings;
			_reportingPeriods = reportingPeriods;
		}

		public ValidationError Execute(Family family, NonBlockingValidationContext context)
		{
			if(family != null)
			{
				var child = context.GetParentEntity<Child>();
				// Enrollments for children living with foster families
				// are exempt from family determination validations
				if (child != null && !child.Foster)
				{
					var enrollment = context.GetParentEntity<Enrollment>();
					if(enrollment != null) {
						var fundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);

						// If enrollment is funded
						if(fundings.Any(f => f.Source == FundingSource.CDC))
						{
							// most recent determination must be < 1 year old from today
							var compareDate = DateTime.Now.Date;

							// unless validating in the context of a report,
							// in which case determination date must be < 1 year from 
							// end of report's reporting period
							var report = context.GetParentEntity<CdcReport>();
							if(report != null)
							{
								compareDate = report.ReportingPeriod?.PeriodEnd ?? _reportingPeriods.GetById(report.ReportingPeriodId).PeriodEnd;
							}

							var mostRecentDetermination = (family.Determinations ?? _determinations.GetDeterminationsByFamilyId(family.Id))
								.OrderByDescending(d => d.DeterminationDate)
								.FirstOrDefault();
							
							if(mostRecentDetermination != null)
							{
								if(mostRecentDetermination.DeterminationDate.HasValue 
									&& mostRecentDetermination.DeterminationDate < compareDate.AddYears(-1)
								)
								{
									return new ValidationError(
										field: "Determinations",
										message: "Annual income determinations is due"
									);
								}
							}
						}
					}
				}
			}

			return null;
		}
	}
}
