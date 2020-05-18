using Hedwig.Models;
using Hedwig.Validations.Attributes;
using Xunit;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HedwigTests.Validations.Attributes
{
	public class Fundings_FundingSpacesAreValidTests
	{
		[Theory]
		[InlineData(Age.Preschool, Age.Preschool, false)]
		[InlineData(Age.Preschool, Age.InfantToddler, true)]
		public void ReturnsValidationResult_IfFundingSpaceAgeGroupDoesNotMatch(
			Age fundingSpaceAge,
			Age enrollmentAge,
			bool returnsResult
		)
		{
			var organizationId = 1;
			var fundingSpace = new FundingSpace
			{
				AgeGroup = fundingSpaceAge,
				OrganizationId = organizationId
			};

			var funding = new Funding();
			funding.GetType().GetProperty(nameof(funding.FundingSpace))
				.SetValue(funding, fundingSpace);
			var fundings = new List<Funding> { funding };

			var site = new Site { OrganizationId = organizationId };
			var enrollment = new Enrollment
			{
				AgeGroup = enrollmentAge,
			};
			enrollment.GetType().GetProperty(nameof(enrollment.Site))
				.SetValue(enrollment, site);

			var validationContext = new ValidationContext(enrollment);
			var attribute = new Fundings_FundingSpaceAgeGroupMatches();
			var result = attribute.GetValidationResult(fundings, validationContext);

			Assert.Equal(returnsResult, result != null);
		}
	}
}
