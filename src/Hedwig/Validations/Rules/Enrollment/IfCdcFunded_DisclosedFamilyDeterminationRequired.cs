using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
  public class IfCdcFunded_DisclosedFamilyDeterminationRequired : IValidationRule<Enrollment>
  {
    readonly IFundingRepository _fundings;
    readonly IChildRepository _children;
    readonly IFamilyRepository _families;
    readonly IFamilyDeterminationRepository _determinations;

    public IfCdcFunded_DisclosedFamilyDeterminationRequired(
      IFundingRepository fundings,
      IChildRepository children,
      IFamilyRepository families,
      IFamilyDeterminationRepository determinations
    )
    {
      _fundings = fundings;
      _children = children;
      _families = families;
      _determinations = determinations;
    }

    public ValidationError Execute(Enrollment enrollment)
    {
      var fundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);
      if(fundings.Any(f => f.Source == FundingSource.CDC))
      {
        var child = enrollment.Child ?? _children.GetChildById(enrollment.ChildId);
        if(child.FamilyId.HasValue)
        {
          var family = child.Family ?? _families.GetFamilyById(child.FamilyId.Value);
          var determinations = family.Determinations ?? _determinations.GetDeterminationsByFamilyId(family.Id);
          var mostRecentDetermination = determinations
            .OrderByDescending(d => d.DeterminationDate)
            .FirstOrDefault();

          if(mostRecentDetermination == null
            || mostRecentDetermination.NotDisclosed)
          {
            return new ValidationError(
              field: "Child.Family.Determinations",
              message: "CDC-funded enrollments required disclosed family income determination"
            );
          }
        }
      }

      return null;
    }
  }
}