using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;
using System;

namespace Hedwig.Validations.Rules
{
	public class IfEnrollmentFunded_DeterminationDateValid : IValidationRule<FamilyDetermination>
	{
		private readonly IFundingRepository _fundings;
		private readonly IReportingPeriodRepository _reportingPeriods;

		public IfEnrollmentFunded_DeterminationDateValid(
			IFundingRepository fundings,
			IReportingPeriodRepository reportingPeriods
		)
		{
			_fundings = fundings;
			_reportingPeriods = reportingPeriods;
		}

		public ValidationError Execute(FamilyDetermination determination, NonBlockingValidationContext context)
		{
			var enrollment = context.GetParentEntity<Enrollment>();
			if (enrollment == null) return null;

			var fundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);
			if (fundings.Any(f => f.Source == FundingSource.CDC))
			{
				// Generally, DeterminationDate must be < 1 year from today
				var compareDate = DateTime.Now.Date;

				// However, if validating in the context of report enrollments,
				// determination date must be < 1 year from end of reporting period
				var report = context.GetParentEntity<CdcReport>();
				if (report != null)
				{
					compareDate = report.ReportingPeriod != null
						? report.ReportingPeriod.PeriodEnd
						: _reportingPeriods.GetById(report.ReportingPeriodId).PeriodEnd;
				}

				if (determination.DeterminationDate < compareDate.AddYears(-1))
				{
					return new ValidationError(
						field: "DeterminationDate",
						message: "Annual income determination is due"
					);
				}
			}

			return null;
		}
	}
}
