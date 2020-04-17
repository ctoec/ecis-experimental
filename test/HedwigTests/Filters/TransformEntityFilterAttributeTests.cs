using Xunit;
using Moq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Filters;
using HedwigTests.Hedwig.Models;

namespace HedwigTests.Filters
{
	public class TransformEntityFilterAttributeTests
	{
		[Fact]
		public void OnActionExecuted_UnsetsTypeSubEntities_ForApplicationModelResponse()
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
			var parentApplicationModel = new ApplicationModel
			{
				ChildApplicationModel = new ApplicationModel()
			};

			executedContext.Setup(ec => ec.Result)
				.Returns(new ObjectResult(parentApplicationModel));

			// When the filter OnActionExecuted is executed with the context
			var filter = new TransformEntityFilterAttribute();
			filter.OnActionExecuted(executedContext.Object);

			// Then child properties of same type as applicationModel are unset
			Assert.Null(parentApplicationModel.ChildApplicationModel);
		}
	}
}
