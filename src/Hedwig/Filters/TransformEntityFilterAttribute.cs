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
		private readonly IDictionary<PropertyInfo, object> UnsetReadOnlyPropertyValues;

		public TransformEntityFilterAttribute()
		{
			UnsetReadOnlyPropertyValues = new Dictionary<PropertyInfo, object>();
		}

		/// <summary>
		/// A filter task that runs before a controller action is invoked.
		/// Finds any incoming arguments that are application models, and
		/// runs necessary pre-processing on them
		/// </summary>
		/// <param name="context"></param>
		public override void OnActionExecuting(ActionExecutingContext context)
		{
			var requestEntities = context.ActionArguments.Values
				.Where(item => item.GetType().IsApplicationModel())
				.ToList();

			UnsetReadOnlyProperties(requestEntities);
		}

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
				ReSetReadOnlyProperties(responseEntity);
			}
		}

		/// <summary>
		/// Given a starting entity node, recursively unsets all read-only
		/// entities in the entire entity object tree, ensuring changes to
		/// read-only entities are discarded.
		/// </summary>
		/// <param name="entity"></param>
		private void UnsetReadOnlyProperties(object entity)
		{
			if (entity is ICollection collection)
			{
				foreach (var item in collection)
				{
					UnsetReadOnlyProperties(item);
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
				if (prop.IsReadOnly())
				{
					var value = prop.GetValue(entity);
					UnsetReadOnlyPropertyValues[prop] = value;
					prop.SetValue(entity, null);
					continue;
				}

				var propValue = prop.GetValue(entity);
				UnsetReadOnlyProperties(propValue);
			}
		}

		private void ReSetReadOnlyProperties(object entity)
		{
			if (entity is ICollection collection)
			{
				foreach (var item in collection)
				{
					ReSetReadOnlyProperties(item);
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
				if (UnsetReadOnlyPropertyValues.ContainsKey(prop))
				{
					prop.SetValue(entity, UnsetReadOnlyPropertyValues[prop]);
					continue;
				}

				var propValue = prop.GetValue(entity);
				ReSetReadOnlyProperties(propValue);
			}
		}

		/// <summary>
		/// Given an entity node, unsets all sub-entities of the specified types.
		/// Recursively appends model types of sub-entities to specified types,
		/// ensuring no nested cyclical references exist.
		/// </summary>
		/// <param name="entity"></param>
		/// <param name="entityType"></param>
		private void UnsetTypeSubEntities(object entity, IEnumerable<Type> entityTypes)
		{
			if (entity is ICollection collection)
			{
				foreach (var item in collection)
				{
					UnsetTypeSubEntities(item, entityTypes);
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
				if (entityTypes.Any(entityType => entityType == type)
				// Do not unset read-only properties or not mapped properties
				&& !prop.IsReadOnly() && !prop.IsNotMapped())
				{
					prop.SetValue(entity, null);
					continue;
				}

				var propValue = prop.GetValue(entity);

				// Recursively remove entities of same type as prop if prop is application model type
				if (type.IsApplicationModel())
				{
					entityTypes = entityTypes.Append(type);
				}
				UnsetTypeSubEntities(propValue, entityTypes);
			}
		}

	}
}
