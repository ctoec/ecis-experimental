using Hedwig.Models;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class LastNameRequiredTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfLastNameDoesNotExist(
			bool lastNameExists,
			bool doesError
		)
		{
			// if 
			var child = new Child();
			if (lastNameExists)
			{
				child.LastName = "Last";
			}

			// when
			var rule = new LastNameRequired();
			var result = rule.Execute(child, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
