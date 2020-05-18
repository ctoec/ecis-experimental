using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class Fundings_FundingSpacesAreValid : ValidationAttribute
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

				var ageGroupResult = AgeGroupMatches(enrollment, funding.FundingSpace);
				if (ageGroupResult != null) return ageGroupResult;

				var siteRepo = validationContext.GetService(typeof(ISiteRepository)) as ISiteRepository;
				var site = enrollment.Site ?? siteRepo.GetSiteById(enrollment.SiteId);
				var organizationResult = OrganizationMatches(site, funding.FundingSpace);

				if (organizationResult != null) return organizationResult;
			}

			return null;
		}

		private ValidationResult AgeGroupMatches(Enrollment enrollment, FundingSpace fundingSpace)
		{
			if (!enrollment.AgeGroup.HasValue)
			{
				return new ValidationResult("Enrollment must have AgeGroup to get Fundings");
			}

			if (enrollment.AgeGroup.Value != fundingSpace.AgeGroup)
			{
				return new ValidationResult("Enrollment AgeGroup must match Funding's FundingSpace AgeGroup");
			}

			return null;
		}

		private ValidationResult OrganizationMatches(Site site, FundingSpace fundingSpace)
		{
			if (site.OrganizationId != fundingSpace.OrganizationId)
			{
				return new ValidationResult("Enrollment's Funding FundingSpaces must belong to Enrollment's Organization");
			}

			return null;
		}
	}
}
