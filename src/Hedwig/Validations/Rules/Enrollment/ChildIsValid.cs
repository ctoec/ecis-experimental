using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;
using System;

namespace Hedwig.Validations.Rules
{
  public class ChildIsValid: SubObjectIsValid, IValidationRule<Enrollment>
  {
    readonly IChildRepository _children;
    public ChildIsValid(
      INonBlockingValidator validator,
      IChildRepository children
    ) : base(validator)
    {
      _children = children;
    }

    public ValidationError Execute(Enrollment enrollment)
    {
      if(enrollment.ChildId != Guid.Empty)
      {
        if(enrollment.Child == null)
        {
          _children.GetChildById(enrollment.ChildId);
        }

        ValidateSubObject(enrollment.Child);
        if(enrollment.Child.ValidationErrors.Count > 0)
        {
          return new ValidationError(
            field: "Child",
            message: "Child has validation errors"
          );
        }
      }

      return null;
    }
  }
}