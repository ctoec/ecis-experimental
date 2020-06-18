using Hedwig.Models;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class ZipRequiredTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfZipDoesNotExist(
			bool zipExists,
			bool doesError
		)
		{
			// if 
			var family = new Family();
			if (zipExists)
			{
				family.Zip = "06103";
			}

			// when
			var rule = new ZipRequired();
			var result = rule.Execute(family, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
