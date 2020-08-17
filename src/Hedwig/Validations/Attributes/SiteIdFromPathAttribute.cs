using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Models;

namespace Hedwig.Validations.Attributes
{
	public class SiteIdFromPathAttribute : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			// Skip this validation for PastEnrollments -- They are not writable, and so there is no
			// potential for them to violate legit access restrictions. Additionally, they will NOT 
			// necessarily have siteId === site id from path (children can move between sites!) so we
			// cannot enforce this validation without blocking legit data updates
			if(validationContext.ObjectInstance is PastEnrollment) return ValidationResult.Success;

			var httpContext = validationContext.GetService(typeof(IHttpContextAccessor)) as HttpContextAccessor;
			var pathSiteIdStr = (string)httpContext.HttpContext.GetRouteValue("siteId");
			if (pathSiteIdStr == null)
			{
				return ValidationResult.Success;
			}

			var pathSiteId = Int32.Parse(pathSiteIdStr);

			var objectSiteId = (int)value;

			if (objectSiteId != pathSiteId)
			{
				return new ValidationResult("Provided siteId must match siteId in path");
			}

			return ValidationResult.Success;
		}
	}
}
