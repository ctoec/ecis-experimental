using Xunit;
using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using Hedwig.Validations.Attributes;

namespace HedwigTests.Validations.Attributes
{
  public class RequiredForFundingSourceTests
  {
	[Theory]
	[InlineData(true, false)]
	[InlineData(false, true)]
	public void IsValid_ReturnsValidationResult_IfValueDoesNotExist_AndObjectInstanceIsOfType(
	  bool valueExists,
	  bool returnsValidationResult
	)
	{
	  // if
	  var funding = new Funding
	  {
		Source = FundingSource.CDC
	  };
	  var validationContext = new ValidationContext(funding);
	  var attribute = new RequiredForFundingSource(FundingSource.CDC);

	  // when
	  var value = valueExists ? new { } : null;
	  var result = attribute.GetValidationResult(value, validationContext);

	  // then 
	  Assert.Equal(returnsValidationResult, result != null);
	}
  }
}
