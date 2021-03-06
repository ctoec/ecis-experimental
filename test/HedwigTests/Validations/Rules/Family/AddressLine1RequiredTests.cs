using Hedwig.Models;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class AddressLine1RequiredTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfAddressLine1DoesNotExist(
			bool addressLine1Exists,
			bool doesError
		)
		{
			// if 
			var family = new Family();
			if (addressLine1Exists)
			{
				family.AddressLine1 = "450 Columbus Blvd.";
			}

			// when
			var rule = new AddressLine1Required();
			var result = rule.Execute(family, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
