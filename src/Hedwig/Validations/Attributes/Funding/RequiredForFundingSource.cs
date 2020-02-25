using System.ComponentModel.DataAnnotations;
using Hedwig.Models;

namespace Hedwig.Validations.Attributes
{
	public class RequiredForFundingSource : ValidationAttribute
	{
		private readonly FundingSource _source;
		public RequiredForFundingSource(FundingSource source)
		{
			_source = source;
		}
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var funding = validationContext.ObjectInstance as Funding;

			if (funding.Source == _source)
			{
				if (value == null)
				{
					return new ValidationResult($"{validationContext.DisplayName} is required for {funding.Source.ToString()} funding");
				}
			}

			return null;
		}
	}
}
