using Hedwig.Models;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class BirthTownRequiredTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfBirthTownDoesNotExist(
			bool birthTownExists,
			bool doesError
		)
		{
			// if 
			var child = new Child();
			if (birthTownExists)
			{
				child.BirthTown = "Townville";
			}

			// when
			var rule = new BirthTownRequired();
			var result = rule.Execute(child, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
