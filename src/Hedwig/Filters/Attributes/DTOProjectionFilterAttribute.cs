using System;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Hedwig.Filters.Attributes
{
	public class DTOProjectionFilterAttribute : ActionFilterAttribute
	{
		public Type Type { get; private set; }
		public DTOProjectionFilterAttribute(
			Type type
		)
		{
			Type = type;
		}
	}
}
