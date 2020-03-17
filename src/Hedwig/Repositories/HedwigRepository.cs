using Hedwig.Data;
using Hedwig.Models;
using System;
using System.Reflection;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
	public abstract class HedwigRepository
	{
		public const string INCLUDE_FAMILY = "family";
		public const string INCLUDE_DETERMINATIONS = "determinations";
		public const string INCLUDE_CHILD = "child";
		public const string INCLUDE_FUNDINGS = "fundings";
		public const string INCLUDE_ENROLLMENTS = "enrollments";
		public const string INCLUDE_SITES = "sites";
		public const string INCLUDE_ORGANIZATIONS = "organizations";
		public const string INCLUDE_FUNDING_SPACES = "funding_spaces";

		protected readonly HedwigContext _context;

		public HedwigRepository(HedwigContext context) => _context = context;

		public Task SaveChangesAsync()
		{
			return _context.SaveChangesAsync();
		}

		public void UpdateEntity<T>(T entity)
		{
		}

		public void UpdateEntity<TEntity, TId>(TEntity entity) where TEntity : class, IHedwigIdEntity<TId>
		{
			// for each property on the entity:
			// 	- if it is a list of entities, update them correctly
			// 	and for each entity, call this func
			// 	- if it is an app model, call this func
			// 	- else do nothing
			var properties = typeof(TEntity).GetProperties();
			foreach(var prop in properties)
			{
				if(prop.PropertyType.IsNonStringEnumerable()
				&& prop.PropertyType.GetEntityType().IsApplicationModel())
				{
					var enumerable = prop.GetValue(entity);
					var enumerableEntityType = prop.PropertyType.GetEntityType();

					var parentEntityReferenceIdProp = enumerableEntityType.GetProperty($"{nameof(TEntity)}Id");
					UpdateEnumerable(enumerable, entity.Id, parentEntityReferenceIdProp);
				}
				else if (prop.PropertyType.GetEntityType().IsApplicationModel())
				{
					var subEntity = prop.GetValue(entity);
					UpdateEntity(subEntity);
				}
			}
		}

		public void UpdateEnumerable<TEntity, TId>(List<TEntity> updatedEnumerable, TId referenceIdValue, PropertyInfo referenceIdProp) where TEntity: class, IHedwigIdEntity<TId>
		{
			var currentEnumerable = _context.Set<TEntity>().AsNoTracking()
				.Where(entity => referenceIdProp.GetValue(entity).Equals(referenceIdValue))
				.ToList();
			if(updatedEnumerable == null)
			{
				return;
			}

			foreach (var current in currentEnumerable)
			{
				if(!updatedEnumerable.Any(u => u.Id.Equals(current.Id)))
				{
					_context.Remove(current);
				}
			}

		}

		/// <summary>
		/// Deletes removed items from enumerable child object array on object update.
		/// Adding and updating in the array happens for free with Entity Framework
		/// </summary>
		/// <param name="updates"></param>
		/// <param name="currents"></param>
		/// <typeparam name="T"></typeparam>
		public void UpdateEnumerableChildObjects<T>(IEnumerable<IHedwigIdEntity<T>> updates, IEnumerable<IHedwigIdEntity<T>> currents)
		{
			if (updates == null)
			{
				return;
			}

			foreach (var current in currents)
			{
				if (!updates.Any(u => u.Id.Equals(current.Id)))
				{
					_context.Remove(current);
				}
			}
		}
	}

	public interface IHedwigRepository
	{
		Task SaveChangesAsync();
	}
}
