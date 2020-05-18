using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class Fundings_FundingSpaceAgeGroupMatches : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var enrollment = validationContext.ObjectInstance as Enrollment;

			var fundings = value as ICollection<Funding> ?? new List<Funding>();

			foreach (var funding in fundings)
			{
				if (funding.FundingSpace == null)
				{
					continue;
				}

				if (!enrollment.AgeGroup.HasValue)
				{
					return new ValidationResult("Enrollment must have AgeGroup to get Fundings");
				}

				if (enrollment.AgeGroup.Value != funding.FundingSpace.AgeGroup)
				{
					return new ValidationResult("Enrollment AgeGroup must match Funding's FundingSpace AgeGroup");
				}
			}

			return null;
		}
	}
}
