using System;
using System.Collections.Generic;
using Hedwig.Validations;
using Hedwig.Validations.Rules;
using Moq;
using Xunit;

namespace HedwigTests.Validations
{
	public class ValidatorTests
	{
		[Fact]
		public void Validate_NoRules()
		{
			// if
			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<TestValidatableEntity>>)))
			.Returns(new List<IValidationRule<TestValidatableEntity>>());

			var validateable = new TestValidatableEntity();

			// when
			var validator = new NonBlockingValidator(serviceProvider.Object);
			validator.Validate(validateable);

			// then
			Assert.Empty(validateable.ValidationErrors);
		}

		[Fact]
		public void Validate_Rules_NoError()
		{
			// if
			var rule = new Mock<IValidationRule<TestValidatableEntity>>();
			rule.Setup(r => r.Execute(It.IsAny<TestValidatableEntity>(), It.IsAny<NonBlockingValidationContext>()))
			.Returns<ValidationError>(null);

			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<TestValidatableEntity>>)))
			.Returns(new List<IValidationRule<TestValidatableEntity>> { rule.Object });

			var validateable = new TestValidatableEntity();

			// when
			var validator = new NonBlockingValidator(serviceProvider.Object);
			validator.Validate(validateable);

			// then
			Assert.Empty(validateable.ValidationErrors);
		}

		[Fact]
		public void Validate_Rules_OnlyError()
		{
			// if
			var rule = new Mock<IValidationRule<TestValidatableEntity>>();
			rule.Setup(r => r.Execute(It.IsAny<TestValidatableEntity>(), It.IsAny<NonBlockingValidationContext>()))
			.Returns(new ValidationError(It.IsAny<string>(), field: It.IsAny<string>()));

			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<TestValidatableEntity>>)))
			.Returns(new List<IValidationRule<TestValidatableEntity>> { rule.Object });

			var validateable = new TestValidatableEntity();

			// when
			var validator = new NonBlockingValidator(serviceProvider.Object);
			validator.Validate(validateable);

			// then
			Assert.Single(validateable.ValidationErrors);
		}
		[Fact]
		public void Validate_Rules_ErrorNoError()
		{
			// if 
			var errorRule = new Mock<IValidationRule<TestValidatableEntity>>();
			errorRule.Setup(r => r.Execute(It.IsAny<TestValidatableEntity>(), It.IsAny<NonBlockingValidationContext>()))
			.Returns(new ValidationError(It.IsAny<string>(), field: It.IsAny<string>()));

			var noErrorRule = new Mock<IValidationRule<TestValidatableEntity>>();
			noErrorRule.Setup(r => r.Execute(It.IsAny<TestValidatableEntity>(), It.IsAny<NonBlockingValidationContext>()))
			.Returns<ValidationError>(null);


			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<TestValidatableEntity>>)))
			.Returns(new List<IValidationRule<TestValidatableEntity>>{
			errorRule.Object, noErrorRule.Object
			 });

			var validateable = new TestValidatableEntity();

			// when
			var validator = new NonBlockingValidator(serviceProvider.Object);
			validator.Validate(validateable);

			// then
			Assert.Single(validateable.ValidationErrors);
		}

		[Fact]
		public void Validate_Rules_NullEntity()
		{
			// if
			var rule = new Mock<IValidationRule<TestValidatableEntity>>();

			var serviceProvider = new Mock<IServiceProvider>();
			serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<TestValidatableEntity>>)))
			.Returns(new List<IValidationRule<TestValidatableEntity>> { rule.Object });

			// when
			var validator = new NonBlockingValidator(serviceProvider.Object);
			validator.Validate(null as TestValidatableEntity);

			// then
			rule.Verify(rule => rule.Execute(It.IsAny<TestValidatableEntity>(), It.IsAny<NonBlockingValidationContext>()), Times.Never());
		}
	}
}
