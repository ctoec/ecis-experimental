using Xunit;
using Moq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Filters;
using Hedwig.Validations;
using HedwigTests.Hedwig.Models;

namespace HedwigTests.Filters
{
	public class ValidateEntityFilterAttributeTests
	{
		[Theory]
		[InlineData(false)]
		[InlineData(true)]
		public void OnActionExecuting_ValidatesEntity_IfOnExecuting(
			bool onExecuting
		)
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

			// and an ActionExecutingContext exists with the ActionContext
			// and with an ActionArgument member
			// with an entry that is an application model
			var applicationModel = new ApplicationModel();
			var actionArguments = new Dictionary<string, object> {
				{ "key", applicationModel }
			};

			var executingContext = new ActionExecutingContext(
				actionContext,
				filterMock.Object,
				actionArguments,
				new object()
			);

			// and an INonBlockingValidator exists
			var _validator = new Mock<INonBlockingValidator>();

			// and a ValidateEntityFilter exists with the validator and isExecuting
			var filter = new ValidateEntityFilterAttribute(_validator.Object, onExecuting);

			// when OnActionExecuting is executed with the context
			filter.OnActionExecuting(executingContext);

			// then the validation is executed if isExecuting, or skipped if not
			var times = onExecuting ? Times.AtLeastOnce() : Times.Never();
			_validator.Verify(v => v.Validate(It.IsAny<INonBlockingValidatableObject>(), null), times);
		}

		[Theory]
		[InlineData(false)]
		[InlineData(true)]
		public void OnActionExecuted_ValidatesEntity_IfNotOnExecuting(
			bool onExecuting
		)
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
			// with an applicatoin model as the value
			var applicationModel = new Hedwig.Models.ApplicationModel();
			executedContext.Setup(ec => ec.Result)
				.Returns(new ObjectResult(applicationModel));

			// and an INonBlockingValidator exists
			var _validator = new Mock<INonBlockingValidator>();

			// and a ValidateEntityFilter exists with the validator and isExecuting
			var filter = new ValidateEntityFilterAttribute(_validator.Object, onExecuting);

			// when OnActionExecuted is executed with the context
			filter.OnActionExecuted(executedContext.Object);

			// then the validation is executed if NOT isExecuting, or skipped if true
			var times = !onExecuting ? Times.AtLeastOnce() : Times.Never();
			_validator.Verify(v => v.Validate(It.IsAny<INonBlockingValidatableObject>(), null), times);
		}
	}
}
