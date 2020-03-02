using System.Collections.Generic;

namespace Hedwig.Validations.Rules
{
	public abstract class SubObjectIsValid
	{
		readonly INonBlockingValidator _validator;
		public SubObjectIsValid(INonBlockingValidator validator)
		{
			_validator = validator;
		}

		protected void ValidateSubObject<T>(T subObject, object parentObject = null) where T : INonBlockingValidatableObject
		{
			_validator.Validate(subObject, parentObject);
		}

		protected void ValidateSubObject<T>(List<T> subObjects, object parentObject = null) where T : INonBlockingValidatableObject
		{
			subObjects.ForEach(subObject => ValidateSubObject(subObject, parentObject));
		}
	}
}
