using Hedwig.Models;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class TownRequiredTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfTownDoesNotExist(
			bool townExists,
			bool doesError
		)
		{
			// if 
			var family = new Family();
			if (townExists)
			{
				family.Town = "Hartford";
			}

			// when
			var rule = new TownRequired();
			var result = rule.Execute(family, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
