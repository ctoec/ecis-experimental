using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using System;

namespace Hedwig.Validations.Attributes
{
  public class ExitReason_RequiredIfExitExists : ValidationAttribute
  {
	protected override ValidationResult IsValid(object value, ValidationContext validationContext)
	{
	  var enrollment = validationContext.ObjectInstance as Enrollment;
	  var exitReason = value as string;

	  if (enrollment.Exit.HasValue && exitReason == null)
	  {
		return new ValidationResult("Enrollment exit reason is required for ended enrollments");
	  }

	  return null;
	}
  }
}
