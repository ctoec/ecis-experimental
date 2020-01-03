using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;
using System;

namespace Hedwig.Validations.Rules
{
	public class EndOfFirstReportingPeriodIsLaterThanEnrollmentStartDate: IValidationRule<Funding>
	{
		readonly IEnrollmentRepository _enrollments;

		public EndOfFirstReportingPeriodIsLaterThanEnrollmentStartDate(
			IEnrollmentRepository enrollments
		) : base() {
			_enrollments = enrollments;
		}

		public ValidationError Execute(Funding funding)
		{
			var enrollment = funding.Enrollment ?? _enrollments.GetEnrollmentById(funding.EnrollmentId);

			if (enrollment == null || !enrollment.Entry.HasValue)
			{
				return null;
			}

			if (enrollment.Entry.Value.Date > funding.FirstReportingPeriod.PeriodEnd.Date)
			{
				return new ValidationError(
					field: "FirstReportingPeriod",
					message: "Reporting period end date must be after enrollment start date"
				);
			}

			return null;
		}
	}
}