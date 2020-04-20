using Xunit;
using Moq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Filters;
using Hedwig.Filters.Attributes;
using Hedwig.Validations;
using HedwigTests.Hedwig.Models;

namespace HedwigTests.Filters
{
	public class ValidateEntityFilterAttributeTests
	{
		public void OnActionExecuted_ValidatesEntity()
		{
			// If an ActionContext exists
			var httpContext = new Mock<HttpContext>();
			var routeData = new Mock<RouteData>();
			var actionDescriptor = new Mock<ActionDescriptor>();
			var actionContext = new ActionContext()
			{
				HttpContext = httpContext.Object,
				RouteData = routeData.Object,
				ActionDescriptor = actionDescriptor.Object
			};

			var filterMock = new Mock<IList<IFilterMetadata>>();

			// and an ActionExecutedContext exists with the ActionContext
			var executedContext = new Mock<ActionExecutedContext>(
				actionContext,
				filterMock.Object,
				new object()
			);

			// with an ObjectResult as the result
			// with an application model as the value
			var applicationModel = new ApplicationModel();
			executedContext.Setup(ec => ec.Result)
				.Returns(new ObjectResult(applicationModel));

			// and an INonBlockingValidator exists
			var _validator = new Mock<INonBlockingValidator>();

			// and a ValidateEntityFilter exists with the validator
			var filter = new ValidateEntityFilter(_validator.Object);

			// and a ValidateEntityFilterAttribute
			var attribute = new Mock<ValidateEntityFilterAttribute>();

			// when OnActionExecuted is executed with the context
			filter.OnActionExecuted(attribute.Object, executedContext.Object);

			// then the validation is executed
			_validator.Verify(v => v.Validate(It.IsAny<INonBlockingValidatableObject>(), null), Times.AtLeastOnce());
		}
	}
}
