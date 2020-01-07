using Hedwig.Validations.Rules;
using Moq;
using Xunit;

namespace HedwigTests.Validations.Rules
{
  public class FieldRequiredTests
  {
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void ValidationError_UsesPrettyFieldName_IfExists(
      bool prettyFieldNameExists
    )
    {
      // if
      var fieldName = "FieldName";
      var prettyFieldName = prettyFieldNameExists ? "Field name" : null;
      var entity = new TestValidatableEntity();

      // when
      var rule = new Mock<FieldRequired<TestValidatableEntity>>(fieldName, prettyFieldName, false);
      rule.CallBase = true;
      var result = rule.Object.Execute(entity);

      // then
      Assert.Equal(!prettyFieldNameExists, result.Message.Contains(fieldName));
    }

    [Theory]
    [InlineData(null, true)]
    [InlineData("", true)]
    [InlineData("Value", false)]
    public void Execute_ReturnsError_IfFieldDoesNotExist_OrIsEmptyString(
      string fieldValue,
      bool doesError
    )
    {
      // if
      var fieldName = "FieldName";
      var entity = new TestValidatableEntity
      {
        FieldName = fieldValue
      };

      // when
      var rule = new Mock<FieldRequired<TestValidatableEntity>>(fieldName, null, false);
      rule.CallBase = true;
      var result = rule.Object.Execute(entity);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}