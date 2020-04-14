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
			UnsetCyclicalCollectionMappings(responseEntity);
			ResetReadOnlyProperties(responseEntity);
		}

		/// <summary>
		/// Given a starting entity node, recursively unsets all read-only
		/// entities in the entire entity object tree, ensuring changes to
		/// read-only entities are discarded.
		/// </summary>
		/// <param name="entity"></param>
		private void UnsetReadOnlyProperties(object entity)
		{
			// Do not attempt to unset read-only properties on null entity
			if (entity == null)
			{
				return;
			}

			// Individually attempt to unset read-only properties on a set of entities
			if (entity is ICollection collection)
			{
				foreach (var item in collection)
				{
					UnsetReadOnlyProperties(item);
				}
				return;
			}

			// Attempt to unset read-only properties on an entity,
			// storing an removed values in a map so they can be reset
			// before returning object to client
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

				// Recurse on props that are models
				var genericType = prop.PropertyType.IsGenericEnumerable() ? prop.PropertyType.GetGenericArguments()[0] : prop.PropertyType;
				if(genericType.IsApplicationModel())
				{
					UnsetReadOnlyProperties(prop.GetValue(entity));
				}
			}
		}

		private void ResetReadOnlyProperties(object entity)
		{
			// Do not attempt to reset read-only properties on null entity
			if(entity == null)
			{
				return;
			}

			// Individually attempt to reset read-only properties on null entity
			if (entity is ICollection collection)
			{
				foreach (var item in collection)
				{
					ResetReadOnlyProperties(item);
				}
				return;
			}

			// Attempt to reset read-only properties on an entity,
			// retrieving values from the map they were stored in
			// upon unset on incoming request
			var properties = entity.GetType().GetProperties();
			foreach (var prop in properties)
			{
				if (UnsetReadOnlyPropertyValues.ContainsKey(prop))
				{
					prop.SetValue(entity, UnsetReadOnlyPropertyValues[prop]);
					UnsetReadOnlyPropertyValues.Remove(prop);
					continue;
				}

				// recurse on props that are models
				var genericType = prop.PropertyType.IsGenericEnumerable() ? prop.PropertyType.GetGenericArguments()[0] : prop.PropertyType;
				if(genericType.IsApplicationModel() && UnsetReadOnlyPropertyValues.Count > 0)
				{
					ResetReadOnlyProperties(prop.GetValue(entity));
				}
			}
		}

		private void UnsetCyclicalCollectionMappings(object entity, HashSet<Type> typesToRemove = null)
		{
			// Initialize typesToRemove set if it does not exist
			typesToRemove = typesToRemove ?? new HashSet<Type>();

			// Do not attempt to unset mappings on null entities
			if (entity == null)
			{
				return;
			}

			// Individually attempt to unset mappings on a set of entities
			if(entity is IEnumerable enumerable)
			{
				foreach(var item in enumerable)
				{
					UnsetCyclicalCollectionMappings(item, typesToRemove);
				}
				return;
			}

			// Attempt to unset cyclical mappings on entity 
			var entityType = entity.GetType();
			var properties = entityType.GetProperties();
			foreach (var prop in properties)
			{
				// If prop is cyclical collection mapping
				var genericType = prop.PropertyType.IsGenericEnumerable() ? prop.PropertyType.GetGenericArguments()[0] : prop.PropertyType;
				if (prop.PropertyType.IsGenericEnumerable() 
					// and the generic type of the collection is in typesToRemove
					&& typesToRemove.Any(type => type.IsAssignableFrom(genericType)))
				{
					prop.SetValue(entity, null);
					return;
				}

				// Recurse on props that are model types that have not already been seen
				// (i.e. that do not appear in typesToRemove -- these cyclical references will be handled by JSON serialization rule )
				if(genericType.IsApplicationModel() && !typesToRemove.Any(type => type.IsAssignableFrom(genericType)))
				{
					var _typesToRemove = new HashSet<Type>(typesToRemove);
					_typesToRemove.Add(entityType);
					UnsetCyclicalCollectionMappings(prop.GetValue(entity), _typesToRemove);
				}
			}
		}
	}
}
