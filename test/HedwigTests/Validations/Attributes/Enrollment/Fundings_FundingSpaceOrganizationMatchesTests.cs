using Hedwig.Models;
using Hedwig.Validations.Attributes;
using Xunit;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HedwigTests.Validations.Attributes
{
	public class Fundings_FundingSpaceOrganizationMatchesTests
	{
		[Theory]
		[InlineData(1, 1, false)]
		[InlineData(1, 2, true)]
		public void ReturnsValidationResult_IfFundingSpaceOrganizationDoesNotMatch(
			int fundingSpaceOrgId,
			int enrollmentSiteOrgId,
			bool returnsResult
		)
		{
			var age = Age.InfantToddler;

			var fundingSpace = new FundingSpace
			{
				OrganizationId = fundingSpaceOrgId,
				AgeGroup = age
			};
			var funding = new Funding();
			funding.GetType().GetProperty(nameof(funding.FundingSpace))
				.SetValue(funding, fundingSpace);
			var fundings = new List<Funding> { funding };

			var site = new Site { OrganizationId = enrollmentSiteOrgId };
			var enrollment = new Enrollment
			{
				AgeGroup = age
			};
			enrollment.GetType().GetProperty(nameof(enrollment.Site))
				.SetValue(enrollment, site);

			var validationContext = new ValidationContext(enrollment);
			var attribute = new Fundings_FundingSpaceOrganizationMatches();
			var result = attribute.GetValidationResult(fundings, validationContext);

			Assert.Equal(returnsResult, result != null);
		}
	}
}
