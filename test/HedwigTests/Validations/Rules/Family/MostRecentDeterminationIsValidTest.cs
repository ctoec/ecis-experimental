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
			determinationRule.Setup(dr => dr.Execute(mostRecent))
			.Returns(mostRecentResult);
			var otherResult = otherIsValid ? null : new ValidationError("message", field: "field");
			determinationRule.Setup(dr => dr.Execute(older))
			.Returns(otherResult);

			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<FamilyDetermination>>)))
			.Returns(new List<IValidationRule<FamilyDetermination>> { determinationRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _determinations = new Mock<IFamilyDeterminationRepository>();

			// when
			var rule = new MostRecentDeterminationIsValid(_validator, _determinations.Object);
			var result = rule.Execute(family);

			// then
			Assert.Equal(doesError, result != null);
		}

		[Fact]
		public void Execute_ReturnsNull_IfFamilyHasChildWithFosterTrue()
		{
			// if
			var child = new Child
			{
				Foster = true
			};
			var family = new Family
			{
				Children = new List<Child> { child }
			};
			var determination = new FamilyDetermination { Family = family };
			family.Determinations = new List<FamilyDetermination> { determination };

			var determinationRule = new Mock<IValidationRule<FamilyDetermination>>();
			determinationRule.Setup(dr => dr.Execute(determination))
			.Returns(new ValidationError("message", field: "field"));
			var _serviceProvider = new Mock<IServiceProvider>();
			_serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<FamilyDetermination>>)))
			.Returns(new List<IValidationRule<FamilyDetermination>> { determinationRule.Object });

			var _validator = new NonBlockingValidator(_serviceProvider.Object);
			var _determinations = new Mock<IFamilyDeterminationRepository>();

			// when
			var rule = new MostRecentDeterminationIsValid(_validator, _determinations.Object);
			var result = rule.Execute(family);

			// then
			Assert.Null(result);
		}
	}
}
