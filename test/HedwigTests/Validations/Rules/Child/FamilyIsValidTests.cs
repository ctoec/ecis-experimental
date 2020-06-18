using System;
using System.Collections.Generic;
using Hedwig.Models;
using Hedwig.Repositories;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Moq;
using Xunit;

namespace HedwigTests.Validations.Rules
{
	public class FamilyIsValidTests
	{
		[Theory]
		[InlineData(true, false)]
		[InlineData(false, true)]
		public void Execute_ReturnsError_IfFamilyIsNotValid(
			bool familyIsValid,
			bool doesError
		)
		{
			// if
			var family = new Family();
			var child = new Child
			{
				FamilyId = 1,
				Family = family
			};

			var familyRule = new Mock<IValidationRule<Family>>();
			var familyResult = familyIsValid ? null : new ValidationError("message", field: "field");
			familyRule.Setup(fr => fr.Execute(family, It.IsAny<NonBlockingValidationContext>()))
			.Returns(familyResult);

			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Family>>)))
			.Returns(new List<IValidationRule<Family>> { familyRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _families = new Mock<IFamilyRepository>();

			// when
			var rule = new FamilyIsValid(_validator, _families.Object);
			var result = rule.Execute(child, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
