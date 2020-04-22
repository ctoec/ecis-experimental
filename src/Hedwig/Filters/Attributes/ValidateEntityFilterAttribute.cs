using Microsoft.AspNetCore.Mvc.Filters;

namespace Hedwig.Filters.Attributes
{
	public class ValidateEntityFilterAttribute : ActionFilterAttribute
	{
		/// <summary>
		/// Flag to indicate if validation should occur before controller action is executed (OnActionExecuting),
		/// or after controller action has executed (OnActionExecuted) 
		/// </summary>
		public readonly bool OnExecuting;
		public ValidateEntityFilterAttribute(
			bool onExecuting = false
		)
		{
			OnExecuting = onExecuting;
		}
	}
}
