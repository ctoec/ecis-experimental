using System;
using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
	public class RaceRequired : IValidationRule<Child>
	{
		public ValidationError Execute(Child child, NonBlockingValidationContext context)
		{
			// At least one of the race fields must = true
			if (!
			(child.AmericanIndianOrAlaskaNative
			|| child.Asian
			|| child.BlackOrAfricanAmerican
			|| child.NativeHawaiianOrPacificIslander
			|| child.White)
			)
			{
				var fields = new string[]
				{
			"AmericanIndianOrAlaskaNative",
			"Asian",
			"BlackOrAfricanAmerican",
			"NativeHawaiianOrPacificIslander",
			"White"
				};
				return new ValidationError(
					fields: fields,
					message: $"One of {String.Join(",", fields)} must be true."
				);
			}

			return null;
		}
	}
}
