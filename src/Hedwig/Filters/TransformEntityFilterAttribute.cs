using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Hedwig.Models.Attributes;

namespace Hedwig.Filters
{
	public class TransformEntityFilterAttribute : ActionFilterAttribute, IActionFilter
	{
		/// <summary>
		/// A filter task that runs after a controller action is invoked.
		/// Determine if the action response is an application model(s), and
		/// runs necessary post-processing on it.
		/// </summary>
		/// <param name="context"></param>
		public override void OnActionExecuted(ActionExecutedContext context)
		{
			var objectResult = (context.Result as ObjectResult);
			if (objectResult == null)
			{
				return;
			}

			var responseEntity = objectResult.Value;
			var responseEntityType = responseEntity.GetType().GetEntityType();

			if (responseEntityType.IsApplicationModel())
			{
				UnsetTypeSubEntities(responseEntity, new Type[] { responseEntityType });
			}
		}

		/// <summary>
		/// Given an entity node, unsets all sub-entities of the specified types.
		/// Recursively appends model types of sub-entities to specified types,
		/// ensuring no nested cyclical references exist.
		/// </summary>
		/// <param name="entity"></param>
		/// <param name="entityType"></param>
		private void UnsetTypeSubEntities(object entity, IEnumerable<Type> typesToRemove)
		{
			// IEnumerable is the most-broadly typed array-like type
			// If there is an issue with array-like types not being filtered out
			// Check that the model type implements IEnumerable
			if (entity is IEnumerable enumerable)
			{
				foreach (var item in enumerable)
				{
					UnsetTypeSubEntities(item, typesToRemove);
				}
				return;
			}

			if (entity == null || !entity.GetType().IsApplicationModel())
			{
				return;
			}

			var properties = entity.GetType().GetProperties();
			foreach (var prop in properties)
			{
				var type = prop.PropertyType.GetEntityType();
				// If the type has already been seen (in typeToRemove)
				// And it is a persisted data value
				// Set the response value to null
				// And continue to the next prop
				if (
					typesToRemove.Any(typeToRemove => typeToRemove == type)
					&& !prop.IsNotMapped()
				)
				{
					prop.SetValue(entity, null);
					continue;
				}

				// Get the value of the prop to recurse on
				var propValue = prop.GetValue(entity);

				var newList = new List<Type>(typesToRemove);
				// Add prop type to typesToremove if prop is application model type
				// And not a read-only property
				// Read only properties should be included no matter what
				// e.g. reporting periods or users
				if (type.IsApplicationModel())
				{
					newList = newList.Append(type).ToList();
				}
				// Recurse down
				UnsetTypeSubEntities(propValue, newList);
			}
		}

	}
}
