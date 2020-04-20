using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Hedwig.Filters.Attributes
{
	public class DTOProjectionFilterAttribute : ActionFilterAttribute
	{
		public readonly Type Type;
		public DTOProjectionFilterAttribute(
			Type type
		)
		{
			Type = type;
		}
	}
}
