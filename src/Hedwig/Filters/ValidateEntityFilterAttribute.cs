using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Validations;
using System.Collections.Generic;
using System.Linq;

namespace Hedwig.Filters
{
	public class ValidateEntityFilterAttribute : ActionFilterAttribute, IActionFilter
	{
		/// <summary>
		/// The validator instance
		/// </summary>
		private readonly INonBlockingValidator _validator;

		/// <summary>
		/// Flag to indicate if validation should occur before controller action is executed (OnActionExecuting),
		/// or after controller action has executed (OnActionExecuted) 
		/// </summary>
		private readonly bool _onExecuting;

		public ValidateEntityFilterAttribute(INonBlockingValidator validator, bool onExecuting = false)
		{
			_validator = validator;
			_onExecuting = onExecuting;
		}

		public override void OnActionExecuting(ActionExecutingContext context)
		{
			if (!_onExecuting) return;

			var requestEntities = context.ActionArguments.Values
				.Where(item => item.GetType().IsApplicationModel())
				.ToList();

			foreach (var entity in requestEntities)
			{
				ValidateEntity(entity);
			}
		}
		public override void OnActionExecuted(ActionExecutedContext context)
		{
			if (_onExecuting) return;


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
			if (entity.GetType().IsNonStringEnumerable())
			{
				_validator.Validate(entity as IEnumerable<INonBlockingValidatableObject>);
			}
			else
			{
				_validator.Validate(entity as INonBlockingValidatableObject);
			}
		}
	}
}
