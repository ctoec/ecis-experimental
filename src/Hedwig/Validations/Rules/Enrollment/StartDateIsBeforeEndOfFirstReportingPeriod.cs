using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
	public class StartDateIsBeforeEndOfFirstReportingPeriod: IValidationRule<Enrollment>
	{
		public StartDateIsBeforeEndOfFirstReportingPeriod(
		) : base() {}

		public ValidationError Execute(Enrollment enrollment)
		{
			var fundings = enrollment.Fundings;
			var cdcFunding = fundings
				.Where(funding => funding.Source == FundingSource.CDC)
				.OrderBy(funding => funding.FirstReportingPeriod.PeriodStart)
				.FirstOrDefault();

			if (cdcFunding == null)
			{
				return null;
			}

			if (enrollment.Entry > cdcFunding.FirstReportingPeriod.PeriodEnd)
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