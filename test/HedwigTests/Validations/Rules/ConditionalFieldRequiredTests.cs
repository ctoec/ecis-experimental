using Hedwig.Validations.Rules;
using Moq;
using Moq.Protected;
using Xunit;

namespace HedwigTests.Validations.Rules
{
  public class ConditionalFieldRequiredTests
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
    [InlineData(true, false, true)]
    [InlineData(true, true, false)]
    [InlineData(false, true, false)]
    [InlineData(false, false, false)]
    public void Execute_ReturnsError_IfConditionTrueAndFieldDoesNotExist(
      bool conditionResult,
      bool fieldExists,
      bool doesError
    )
    {
      // if
      var fieldName = "FieldName";
      var entity = new TestValidatableEntity();
      if (fieldExists)
      {
        entity.FieldName = true;
      }

      // when
      var rule = new Mock<ConditionalFieldRequired<TestValidatableEntity>>("condition Message", fieldName, null);
      rule.Protected()
        .Setup<bool>("CheckCondition", new object[]{entity})
        .Returns(conditionResult);
      rule.CallBase = true;
      var result = rule.Object.Execute(entity);

      // then
      Assert.Equal(doesError, result != null);
    }
  }
}