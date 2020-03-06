using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Hedwig.Models.Attributes;

namespace Hedwig.Filters
{
	public class TransformEntityFilterAttribute : ActionFilterAttribute, IActionFilter
	{
		/// <summary>
		/// A filter task that runs before a controller action is invoked.
		/// Finds any incoming arguments that are application models, and 
		/// runs necessary pre-processing on them
		/// </summary>
		/// <param name="context"></param>
		public override void OnActionExecuting(ActionExecutingContext context)
		{
			var requestEntities = context.ActionArguments.Values
				.Where(item => IsApplicationModelType(item.GetType()))
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
			var responseEntities = (context.Result as ObjectResult).Value;

			var responseEntityType = GetEntityType(responseEntities.GetType());
			if (IsApplicationModelType(responseEntityType))
			{
				UnsetTypeSubEntities(responseEntities, new Type[] { responseEntityType });
			}
		}

		/// <summary>
		/// Given a starting entity node, recursively unsets all read-only
		/// entities in the entire entity object tree, ensuring changes to
		/// read-only entities are discarded.
		/// </summary>
		/// <param name="entity"></param>
		private static void UnsetReadOnlyProperties(object entity)
		{
			if (entity is ICollection collection)
			{
				foreach (var item in collection)
				{
					UnsetReadOnlyProperties(item);
				}
				return;
			}

			if (entity == null || !IsApplicationModelType(entity.GetType()))
			{
				return;
			}

			var properties = entity.GetType().GetProperties();
			foreach (var prop in properties)
			{
				if (ReadOnlyAttribute.IsReadOnly(prop))
				{
					prop.SetValue(entity, null);
					continue;
				}

				var propValue = prop.GetValue(entity);
				UnsetReadOnlyProperties(propValue);
			}
		}

		/// <summary>
		/// Given an entity node, unsets all sub-entities of the specified types.
		/// Recursively appends model types of sub-entities to specified types,
		/// ensuring no nested cyclical references exist.
		/// </summary>
		/// <param name="entity"></param>
		/// <param name="entityType"></param>
		private static void UnsetTypeSubEntities(object entity, IEnumerable<Type> entityTypes)
		{
			if (entity is ICollection collection)
			{
				foreach (var item in collection)
				{
					UnsetTypeSubEntities(item, entityTypes);
				}
				return;
			}

			if (entity == null || !IsApplicationModelType(entity.GetType()))
			{
				return;
			}

			var properties = entity.GetType().GetProperties();
			foreach (var prop in properties)
			{
				var type = GetEntityType(prop.PropertyType);
				if (entityTypes.Any(entityType => entityType == type))
				{
					prop.SetValue(entity, null);
					continue;
				}

				var propValue = prop.GetValue(entity);
				if (IsApplicationModelType(type))
				{
					entityTypes = entityTypes.Append(type);
				}
				UnsetTypeSubEntities(propValue, entityTypes);
			}
		}

		/// <summary>
		/// Helper function to determine if a given object is an application model type
		/// </summary>
		/// <param name="entity"></param>
		/// <returns></returns>
		private static bool IsApplicationModelType(Type entityType)
		{
			return entityType.Namespace.Contains(nameof(Hedwig.Models))
				&& !(entityType.IsEnum);
		}

		/// <summary>
		/// Helper function to get the underlying generic type of an ICollection type,
		/// or the original type otherwise.abstract Ex:
		/// 	GetEntityType(typeof(List<TInner>)) returns TInner
		/// 	GetEntityType(typeof(T)) returns T
		/// </summary>
		/// <param name="type"></param>
		/// <returns></returns>
		private static Type GetEntityType(Type type)
		{
			return type.IsGenericType && (
				type.GetGenericTypeDefinition() == typeof(ICollection<>)
				|| type.GetGenericTypeDefinition() == typeof(List<>)
			)
				? type.GetGenericArguments()[0]
				: type;
		}
	}
}
