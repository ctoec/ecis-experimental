using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Hedwig.Filters.Attributes;

namespace Hedwig.Filters
{
	public class DTOProjectionFilter : IHedwigActionFilter<DTOProjectionFilterAttribute>
	{
		private readonly IMapper _mapper;
		public DTOProjectionFilter(
			IMapper mapper
		)
		{
			_mapper = mapper;
		}

		public void OnActionExecuting(DTOProjectionFilterAttribute attribute, ActionExecutingContext context)
		{
			return;
		}

		public void OnActionExecuted(DTOProjectionFilterAttribute attribute, ActionExecutedContext context)
		{
			var objectResult = (context.Result as ObjectResult);
			if (objectResult == null)
			{
				return;
			}

			var responseEntity = objectResult.Value;
			var responseEntityType = responseEntity.GetType();

			if (responseEntityType.GetGenericType().IsApplicationModel())
			{
				// Filter through dto to remove undesired properties
				var responseEntityAsDto = _mapper.Map(responseEntity, responseEntityType, attribute.Type);
				objectResult.Value = _mapper.Map(responseEntityAsDto, attribute.Type, responseEntityType);
			}
		}
	}
}
