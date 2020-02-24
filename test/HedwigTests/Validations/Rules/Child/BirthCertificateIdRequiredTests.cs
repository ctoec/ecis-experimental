using Xunit;
using Hedwig.Models;
using Hedwig.Validations.Rules;

namespace HedwigTests.Validations.Rules
{
  public class BirthCertificateIdRequiredTests
  {
	[Theory]
	[InlineData(true, false)]
	[InlineData(false, true)]
	public void Execute_ReturnsError_IfBirthCertificateIdDoesNotExist(
	  bool birthCertificateIdExists,
	  bool doesError
	)
	{
	  // if 
	  var child = new Child();
	  if (birthCertificateIdExists)
	  {
		child.BirthCertificateId = "0000000000000";
	  }

	  // when
	  var rule = new BirthCertificateIdRequired();
	  var result = rule.Execute(child);

	  // then
	  Assert.Equal(doesError, result != null);
	}
  }
}
