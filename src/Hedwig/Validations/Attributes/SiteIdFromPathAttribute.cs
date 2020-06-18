using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Hedwig.Validations.Attributes
{
	public class SiteIdFromPathAttribute : ValidationAttribute
	{
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
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
