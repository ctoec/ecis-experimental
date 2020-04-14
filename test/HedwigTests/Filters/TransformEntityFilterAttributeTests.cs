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
using System.Linq;

namespace HedwigTests.Filters
{
	public class TransformEntityFilterAttributeTests
	{
		[Fact]
		public void OnActionExecuting_UnsetsReadOnlyProperties_OnApplicationModels()
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
			var applicationModel = new ApplicationModel
			{
				// with a read-only propery with a value
				ReadOnlyProperty = "VALUE"
			};
			var actionArguments = new Dictionary<string, object> {
				{ "key", applicationModel }
			};

			var executingContext = new ActionExecutingContext(
				actionContext,
				filterMock.Object,
				actionArguments,
				new object()
			);

			// When OnActionExecuting is executed with the context
			var filter = new TransformEntityFilterAttribute();
			filter.OnActionExecuting(executingContext);

			// Then the read-only property on the application model is unset
			Assert.Null(applicationModel.ReadOnlyProperty);
		}

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
				ChildApplicationModels = new List<ApplicationModel> {new ApplicationModel() }
			};

			executedContext.Setup(ec => ec.Result)
				.Returns(new ObjectResult(parentApplicationModel));

			// When the filter OnActionExecuted is executed with the context
			var filter = new TransformEntityFilterAttribute();
			filter.OnActionExecuted(executedContext.Object);

			// Then child properties of same type as applicationModel on any CHILDREN of the object are unset
			Assert.Null(parentApplicationModel.ChildApplicationModels.First().ChildApplicationModels);
		}
	}
}
