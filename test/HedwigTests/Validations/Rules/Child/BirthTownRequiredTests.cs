using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

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
			var result = rule.Execute(child);

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
