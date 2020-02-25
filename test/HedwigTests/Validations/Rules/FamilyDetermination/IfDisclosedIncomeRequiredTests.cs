using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
	public class IfDisclosedIncomeRequiredTests
	{
		[Theory]
		[InlineData(true, true, false)]
		[InlineData(false, false, false)]
		[InlineData(true, false, true)]
		public void Execute_ReturnsError_IfDisclosedAndIncomeDoesNotExist(
			bool disclosed,
			bool incomeExists,
			bool doesError
		)
		{
			// if 
			var determination = new FamilyDetermination
			{
				NotDisclosed = !disclosed,
			};

			if (incomeExists)
			{
				determination.Income = 10000;
			}

			// when
			var rule = new IfDisclosed_IncomeRequired();
			var result = rule.Execute(determination);

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
