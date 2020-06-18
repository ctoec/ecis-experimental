using System;
using System.Collections.Generic;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Rules
{
	public class ChildIsValid : SubObjectIsValid, IValidationRule<Enrollment>
	{
		readonly IChildRepository _children;
		public ChildIsValid(
			INonBlockingValidator validator,
			IChildRepository children
		) : base(validator)
		{
			_children = children;
		}

		public ValidationError Execute(Enrollment enrollment, NonBlockingValidationContext context)
		{
			if (enrollment.ChildId != Guid.Empty)
			{
				var child = enrollment.Child ?? _children.GetChildById(enrollment.ChildId);

				ValidateSubObject(child, enrollment);
				if (child.ValidationErrors.Count > 0)
				{
					return new ValidationError(
					field: "Child",
					message: "Child has validation errors",
					isSubObjectValidation: true
					);
				}
			}

			return null;
		}
	}
}
