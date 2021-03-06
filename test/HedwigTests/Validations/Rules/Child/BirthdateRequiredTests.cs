using System;
using Hedwig.Models;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class BirthdateRequiredTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfBirthdateDoesNotExist(
			bool birthdateExists,
			bool doesError
		)
		{
			// if 
			var child = new Child();
			if (birthdateExists)
			{
				child.Birthdate = DateTime.Now;
			}

			// when
			var rule = new BirthdateRequired();
			var result = rule.Execute(child, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
