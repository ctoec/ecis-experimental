using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;
using System.Collections.Generic;

namespace Hedwig.Validations.Rules
{
	public class ReportFundingsAreValid : SubObjectIsValid, IValidationRule<CdcReport>
	{
		readonly IReportRepository _reports;
		readonly IFundingRepository _fundings;

		public ReportFundingsAreValid(
			INonBlockingValidator validator,
			IReportRepository reports,
			IFundingRepository fundings
		) : base(validator)
		{
			_reports = reports;
			_fundings = fundings;
		}

		public ValidationError Execute(CdcReport report, NonBlockingValidationContext context)
		{

			var enrollments = report.Enrollments ?? _reports.GetEnrollmentsForReport(report);
			var fundings = new List<Funding>();
			foreach (var enrollment in enrollments)
			{
				var newFundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);
				fundings.AddRange(newFundings);
			}
			ValidateSubObject(fundings, report);
			if (fundings.Any(e => e.ValidationErrors.Count > 0))
			{
				return new ValidationError(
					field: "Enrollments.Fundings",
					message: "Fundings have validation errors",
					isSubObjectValidation: true
				);
			}

			return null;
		}
	}
}
