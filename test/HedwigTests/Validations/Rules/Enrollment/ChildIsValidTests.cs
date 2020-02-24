using Hedwig.Models;
using Hedwig.Validations.Rules;
using Hedwig.Validations;
using Moq;
using System;
using System.Collections.Generic;
using Hedwig.Repositories;
using Xunit;

namespace HedwigTests.Validations.Rules
{
  public class ChildIsValidTests
  {
	[Theory]
	[InlineData(true, false)]
	[InlineData(false, true)]
	public void Execute_ReturnsError_IfChildIsNotValid(
	  bool childIsValid,
	  bool doesError
	)
	{
	  // if
	  var child = new Child();
	  var enrollment = new Enrollment
	  {
		ChildId = Guid.NewGuid(),
		Child = child
	  };

	  var childRule = new Mock<IValidationRule<Child>>();
	  var childResult = childIsValid ? null : new ValidationError("message", field: "field");
	  childRule.Setup(cr => cr.Execute(child))
		.Returns(childResult);

	  var _serviceProvider = new Mock<IServiceProvider>();
	  _serviceProvider.Setup(sp => sp.GetService(typeof(IEnumerable<IValidationRule<Child>>)))
		.Returns(new List<IValidationRule<Child>> { childRule.Object });

	  var _validator = new NonBlockingValidator(_serviceProvider.Object);
	  var _children = new Mock<IChildRepository>();

	  // when
	  var rule = new ChildIsValid(_validator, _children.Object);
	  var result = rule.Execute(enrollment);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
