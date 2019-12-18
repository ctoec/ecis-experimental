using Hedwig.Models;
using System;

namespace Hedwig.Validations.Rules
{
  public class DeterminedWithinSixMonths : IValidationRule<FamilyDetermination>
  {
    public ValidationError Execute(FamilyDetermination determination)
    {
      if(determination.DeterminationDate < DateTime.Now.AddMonths(-6))
      {
        return new ValidationError(
          field: determination.DeterminationDate.GetType().Name,
          message: "Family income must be determined in past 6 months"
        );
      }

      return null;
    }
  }
}