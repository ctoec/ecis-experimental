using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class GenderMustBeSpecified : IValidationRule<Child>
	{
		public ValidationError Execute(Child child)
		{
			if (child.Gender == Gender.Unspecified)
			{
				return new ValidationError(
					field: "Gender",
					message: "Gender must be specified"
				);
			}

			return null;
		}
	}
}
