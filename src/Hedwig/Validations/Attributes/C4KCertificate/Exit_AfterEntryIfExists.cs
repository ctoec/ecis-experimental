using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using System;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
	public class EndDate_AfterStartDateIfExists : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var certificate = validationContext.ObjectInstance as C4KCertificate;
			var endDate = value as DateTime?;

			if (endDate.HasValue && certificate.StartDate.HasValue)
			{
				if (endDate.Value < certificate.StartDate.Value)
				{
					return new ValidationResult("C4K Certiticate end date cannot be before start date date");
				}
			}

			return null;
		}
	}
}
