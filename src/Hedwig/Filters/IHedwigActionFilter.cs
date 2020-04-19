using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Hedwig.Filters
{
	public interface IHedwigActionFilter<TAttribute> where TAttribute : Attribute
	{
		void OnActionExecuting(TAttribute attribute, ActionExecutingContext context);
		void OnActionExecuted(TAttribute attribute, ActionExecutedContext context);
	}
}
