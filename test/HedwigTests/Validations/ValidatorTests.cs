using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using Hedwig.Validations;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations
{

  public class Validateable : INonBlockingValidatableObject
  {
    public List<ValidationError> ValidationErrors { get; set; }
  }
  public class ValidatorTests
  {
    [Fact]
    public void Validate_NoRules()
    {
      // if
      var serviceProvider = new Mock<IServiceProvider>();
      serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Validateable>>)))
        .Returns(new List<IValidationRule<Validateable>>());

      var validateable = new Validateable();

      // when
      var validator = new Validator(serviceProvider.Object);
      validator.Validate(validateable);

      // then
      Assert.Empty(validateable.ValidationErrors);
    }

    [Fact]
    public void Validate_Rules_NoError()
    {
      // if
      var rule = new Mock<IValidationRule<Validateable>>();
      rule.Setup(r => r.Execute(It.IsAny<Validateable>()))
        .Returns<ValidationError>(null);

      var serviceProvider = new Mock<IServiceProvider>();
      serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Validateable>>)))
        .Returns(new List<IValidationRule<Validateable>>{ rule.Object });

      var validateable = new Validateable();

      // when
      var validator = new Validator(serviceProvider.Object);
      validator.Validate(validateable);

      // then
      Assert.Empty(validateable.ValidationErrors);
    }

    [Fact]
    public void Validate_Rules_OnlyError()
    {
      // if
      var rule = new Mock<IValidationRule<Validateable>>();
      rule.Setup(r => r.Execute(It.IsAny<Validateable>()))
        .Returns(new ValidationError(It.IsAny<string>(), It.IsAny<string>()));

      var serviceProvider = new Mock<IServiceProvider>();
      serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Validateable>>)))
        .Returns(new List<IValidationRule<Validateable>>{ rule.Object });

      var validateable = new Validateable();

      // when
      var validator = new Validator(serviceProvider.Object);
      validator.Validate(validateable);

      // then
      Assert.Single(validateable.ValidationErrors);
    }
    [Fact]
    public void Validate_Rules_ErrorNoError()
    {
      // if 
      var errorRule = new Mock<IValidationRule<Validateable>>();
      errorRule.Setup(r => r.Execute(It.IsAny<Validateable>()))
        .Returns(new ValidationError(It.IsAny<string>(), It.IsAny<string>()));

      var noErrorRule = new Mock<IValidationRule<Validateable>>();
      noErrorRule.Setup(r => r.Execute(It.IsAny<Validateable>()))
        .Returns<ValidationError>(null);


      var serviceProvider = new Mock<IServiceProvider>();
      serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Validateable>>)))
        .Returns(new List<IValidationRule<Validateable>>{ 
          errorRule.Object, noErrorRule.Object 
         });

      var validateable = new Validateable();

      // when
      var validator = new Validator(serviceProvider.Object);
      validator.Validate(validateable);

      // then
      Assert.Single(validateable.ValidationErrors);
    }
  }
}