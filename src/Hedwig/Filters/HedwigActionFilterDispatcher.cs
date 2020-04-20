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
			var controllerAttributes = GetControllerAttributes(context.Controller, context.ActionDescriptor as ControllerActionDescriptor);

			foreach (var attribute in controllerAttributes)
			{
				var filterType = typeof(IHedwigActionFilter<>).MakeGenericType(attribute.GetType());
				var filters = _serviceProvider.GetServices(filterType);
				foreach (dynamic filter in filters)
				{
					filter.OnActionExecuting((dynamic)attribute, context);
				}
			}
		}

		public void OnActionExecuted(ActionExecutedContext context)
		{
			var controllerAttributes = GetControllerAttributes(context.Controller, context.ActionDescriptor as ControllerActionDescriptor);

			foreach (var attribute in controllerAttributes)
			{
				var filterType = typeof(IHedwigActionFilter<>).MakeGenericType(attribute.GetType());
				var filters = _serviceProvider.GetServices(filterType);
				foreach (dynamic filter in filters)
				{
					filter.OnActionExecuted((dynamic)attribute, context);
				}
			}
		}

		private List<Attribute> GetControllerAttributes(object controller, ControllerActionDescriptor descriptor)
		{
			var attributes = controller.GetType().GetCustomAttributes(true);
			var attributesList = new List<Attribute>();
			foreach (Attribute attribute in attributes)
			{
				attributesList.Add(attribute);
			}

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

			return attributesList;
		}
	}
}
