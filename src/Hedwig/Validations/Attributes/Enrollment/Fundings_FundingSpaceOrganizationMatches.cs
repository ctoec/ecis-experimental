using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class Fundings_FundingSpaceOrganizationMatches : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var enrollment = validationContext.ObjectInstance as Enrollment;

			var fundings = value as ICollection<Funding> ?? new List<Funding>();

			var siteRepo = validationContext.GetService(typeof(ISiteRepository)) as ISiteRepository;

			foreach (var funding in fundings)
			{
				if (funding.FundingSpace == null)
				{
					continue;
				}

				var site = enrollment.Site ?? siteRepo.GetSiteById(enrollment.SiteId);
				if (site.OrganizationId != funding.FundingSpace.OrganizationId)
				{
					return new ValidationResult("Enrollment's Funding FundingSpaces must belong to Enrollment's Organization");
				}
			}

			return null;
		}
	}
}
