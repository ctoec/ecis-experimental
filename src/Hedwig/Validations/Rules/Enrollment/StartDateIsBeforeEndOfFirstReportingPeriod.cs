using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
	public class StartDateIsBeforeEndOfFirstReportingPeriod: IValidationRule<Enrollment>
	{

		private readonly IFundingRepository _fundings;
		public StartDateIsBeforeEndOfFirstReportingPeriod(
			IFundingRepository fundings
		) : base() {
			_fundings = fundings;
		}

		public ValidationError Execute(Enrollment enrollment)
		{
			var fundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);
			var cdcFunding = fundings
				.Where(funding => funding.Source == FundingSource.CDC)
				.OrderBy(funding => funding.FirstReportingPeriod.PeriodStart)
				.FirstOrDefault();

			if (cdcFunding == null)
			{
				return null;
			}

			if(!enrollment.Entry.HasValue)
			{
				return null;
			}


			if (enrollment.Entry.Value.Date > cdcFunding.FirstReportingPeriod.PeriodEnd.Date)
			{
				return new ValidationError(
					field: "Entry",
					message: "Start date cannot be later than end of first reporting period"
				);
			}

			return null;
		}
	}
}