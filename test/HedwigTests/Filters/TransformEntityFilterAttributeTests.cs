using Xunit;
using Moq;
using Hedwig.Models.Attributes;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Hedwig.Models
{
	public class ApplicationModel
	{
		[ReadOnly]
		public object ReadOnlyProperty { get; set; }

		public ApplicationModel ChildApplicationModel { get; set; }
	}
}

namespace Hedwig.Filters
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
			var applicationModel = new Hedwig.Models.ApplicationModel
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

			// When the filter OnActionExecuting is executed with the context
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
			// with an application model
			var parentApplicationModel = new Hedwig.Models.ApplicationModel
			{
				ChildApplicationModel = new Hedwig.Models.ApplicationModel()
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
