using Xunit;
using Hedwig.Models;
using Moq;
using Hedwig.Validations.Rules;
using Hedwig.Validations;
using Hedwig.Repositories;
using System.Collections.Generic;
using System;

namespace HedwigTests.Validations.Rules
{
	public class MostRecentDeterminationIsValidTests
	{
		[Theory]
		[InlineData(true, false, false)]
		[InlineData(false, true, true)]
		public void Execute_ReturnsError_IfMostRecentDeterminationIsNotValid(
			bool mostRecentIsValid,
			bool otherIsValid,
			bool doesError
		)
		{
			// if
			var family = new Family();
			var mostRecent = new FamilyDetermination
			{
				DeterminationDate = DateTime.Now,
				Family = family
			};
			var older = new FamilyDetermination
			{
				DeterminationDate = DateTime.Now.AddMonths(-6),
				Family = family
			};

			family.Determinations = new List<FamilyDetermination> { older, mostRecent };

			var determinationRule = new Mock<IValidationRule<FamilyDetermination>>();
			var mostRecentResult = mostRecentIsValid ? null : new ValidationError("message", field: "field");
			determinationRule.Setup(dr => dr.Execute(mostRecent, It.IsAny<NonBlockingValidationContext>()))
			.Returns(mostRecentResult);
			var otherResult = otherIsValid ? null : new ValidationError("message", field: "field");
			determinationRule.Setup(dr => dr.Execute(older, It.IsAny<NonBlockingValidationContext>()))
			.Returns(otherResult);

			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<FamilyDetermination>>)))
			.Returns(new List<IValidationRule<FamilyDetermination>> { determinationRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _determinations = new Mock<IFamilyDeterminationRepository>();

			// when
			var rule = new MostRecentDeterminationIsValid(_validator, _determinations.Object);
			var result = rule.Execute(family, new NonBlockingValidationContext());

			// then
			Assert.Equal(doesError, result != null);
		}

		[Fact]
		public void Execute_ReturnsNull_IfParentEntityIsChildWithFosterTrue()
		{
			// if
			var family = new Family();
			var determination = new FamilyDetermination { Family = family };
			family.Determinations = new List<FamilyDetermination> { determination };

			var determinationRule = new Mock<IValidationRule<FamilyDetermination>>();
			determinationRule.Setup(dr => dr.Execute(determination, It.IsAny<NonBlockingValidationContext>()))
			.Returns(new ValidationError("message", field: "field"));
			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<FamilyDetermination>>)))
			.Returns(new List<IValidationRule<FamilyDetermination>> { determinationRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _determinations = new Mock<IFamilyDeterminationRepository>();

			// when
			var rule = new MostRecentDeterminationIsValid(_validator, _determinations.Object);
			var validationContext = new NonBlockingValidationContext();
			validationContext.AddParentEntity(new Child { Foster = true });
			var result = rule.Execute(family, validationContext);

			// then
			Assert.Null(result);
		}
	}
}
