using Hedwig.Validations;
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
			var result = rule.Object.Execute(entity, new NonBlockingValidationContext());

			// then
			Assert.Equal(!prettyFieldNameExists, result.Message.Contains(fieldName));
		}

		[Theory]
		[InlineData(true, null, true)]
		[InlineData(true, "", true)]
		[InlineData(true, "Value", false)]
		[InlineData(false, "Value", false)]
		[InlineData(false, null, false)]
		[InlineData(false, "", false)]
		public void Execute_ReturnsError_IfConditionTrueAndFieldDoesNotExist_OrIsEmptyString(
			bool conditionResult,
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
			var validationContext = new NonBlockingValidationContext();
			var rule = new Mock<ConditionalFieldRequired<TestValidatableEntity>>("condition Message", fieldName, null);
			rule.Protected()
			.Setup<bool>("CheckCondition", new object[] { entity, validationContext })
			.Returns(conditionResult);
			rule.CallBase = true;
			var result = rule.Object.Execute(entity, validationContext);

			// then
			Assert.Equal(doesError, result != null);
		}
	}
}
