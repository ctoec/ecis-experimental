using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using System;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
  public class Exit_AfterEntryIfExists : ValidationAttribute
  {
	protected override ValidationResult IsValid(object value, ValidationContext validationContext)
	{
	  var enrollment = validationContext.ObjectInstance as Enrollment;
	  var exit = value as DateTime?;

	  if (exit.HasValue && enrollment.Entry.HasValue)
	  {
		if (exit.Value < enrollment.Entry.Value)
		{
		  return new ValidationResult("Enrollment exit date cannot be before entry date");
		}
	  }

	  return null;
	}
  }
}
