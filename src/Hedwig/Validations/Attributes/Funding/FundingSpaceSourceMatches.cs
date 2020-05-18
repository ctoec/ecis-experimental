using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class FundingSpaceSourceMatches : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var funding = validationContext.ObjectInstance as Funding;


			if (funding.FundingSpaceId.HasValue)
			{
				var fundingSpaceRepo = validationContext.GetService(typeof(IFundingSpaceRepository)) as IFundingSpaceRepository;
				var fundingSpace = funding.FundingSpace ?? fundingSpaceRepo.GetById(funding.FundingSpaceId.Value);
				if (funding.Source != fundingSpace.Source)
				{
					return new ValidationResult("Funding can only be associated with FundingSpace for same Source");
				}
			}

			return null;
		}
	}
}
