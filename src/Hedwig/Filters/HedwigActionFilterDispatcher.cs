using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace Hedwig.Filters
{
	public class HedwigActionFilterDispatcher : IActionFilter
	{
		readonly IServiceProvider _serviceProvider;
		public HedwigActionFilterDispatcher(
			IServiceProvider serviceProvider
		)
		{
			_serviceProvider = serviceProvider;
		}

		public void OnActionExecuting(ActionExecutingContext context)
		{
			return;
		}

		public void OnActionExecuted(ActionExecutedContext context)
		{
			var attributes = context.Controller.GetType().GetCustomAttributes(true);
			var attributesList = new List<Attribute>();
			foreach (Attribute attribute in attributes)
			{
				attributesList.Add(attribute);
			}

			var descriptor = context.ActionDescriptor as ControllerActionDescriptor;
			if (descriptor != null)
			{
				foreach (Attribute item in descriptor.MethodInfo.GetCustomAttributes(false))
				{
					if (item != null)
					{
						attributesList.Add(item);
					}
				}
			}

			foreach (var attribute in attributesList)
			{
				var filterType = typeof(IHedwigActionFilter<>).MakeGenericType(attribute.GetType());
				var filters = _serviceProvider.GetServices(filterType);
				foreach (dynamic filter in filters)
				{
					filter.OnActionExecuted((dynamic)attribute, context);
				}
			}
		}
	}
}
