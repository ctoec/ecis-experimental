using Microsoft.AspNetCore.Mvc.Filters;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Filters.Attributes;
using Hedwig.Validations;

namespace Hedwig.Filters
{
	public class ValidateEntityFilter : IHedwigActionFilter<ValidateEntityFilterAttribute>
	{
		/// <summary>
		/// The validator instance
		/// </summary>
		private readonly INonBlockingValidator _validator;

		public ValidateEntityFilter(INonBlockingValidator validator)
		{
			_validator = validator;
		}

		public void OnActionExecuting(ValidateEntityFilterAttribute attribute, ActionExecutingContext context)
		{
			if (!attribute.OnExecuting) return;

			var requestEntities = context.ActionArguments.Values
				.Where(item => item.GetType().IsApplicationModel())
				.ToList();

			foreach (var entity in requestEntities)
			{
				ValidateEntity(entity);
			}
		}
		public void OnActionExecuted(ValidateEntityFilterAttribute attribute, ActionExecutedContext context)
		{
			if (attribute.OnExecuting) return;


			var objectResult = (context.Result as ObjectResult);
			if (objectResult == null)
			{
				return;
			}

			var responseEntity = objectResult.Value;

			ValidateEntity(responseEntity);
		}

		/// <summary>
		/// Runs validation for a given object, either as a single INonBlockingValidatableObject,
		/// or an IEnumerable<INonBlockingValidatableObject> if the object is enumerable.
		/// Does not check that object can be cast to these types; rather relies on null result
		/// if the cast fails, which is handled by Validate
		/// </summary>
		/// <param name="entity"></param>
		private void ValidateEntity(object entity)
		{
			if (entity is IEnumerable<INonBlockingValidatableObject>)
			{
				_validator.Validate(entity as IEnumerable<INonBlockingValidatableObject>);
			}
			else if(entity is INonBlockingValidatableObject)
			{
				_validator.Validate(entity as INonBlockingValidatableObject);
			}
		}
	}
}
