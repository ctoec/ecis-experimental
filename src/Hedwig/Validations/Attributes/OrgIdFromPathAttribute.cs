using System.ComponentModel.DataAnnotations;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Hedwig.Validations.Attributes
{
  public class OrgIdFromPathAttribute : ValidationAttribute
  {
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
      var httpContext = validationContext.GetService(typeof(IHttpContextAccessor)) as HttpContextAccessor;
      var pathOrgId = Int32.Parse((string)httpContext.HttpContext.GetRouteValue("orgId"));

      var objectOrgId = (int)value;

      if(objectOrgId != pathOrgId)
      {
        return new ValidationResult("Provided organizationId must match organizationId in path");
      }

      return ValidationResult.Success;
    }
  }
}