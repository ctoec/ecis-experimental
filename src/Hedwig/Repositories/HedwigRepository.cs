using Hedwig.Data;
using Hedwig.Models;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Hedwig.Repositories
{
	public abstract class HedwigRepository
	{
		public const string INCLUDE_FAMILY = "family";
		public const string INCLUDE_DETERMINATIONS = "determinations";
		public const string INCLUDE_CHILD = "child";
		public const string INCLUDE_FUNDINGS = "fundings";
		public const string INCLUDE_ENROLLMENTS = "enrollments";
		public const string INCLUDE_PAST_ENROLLMENTS = "past_enrollments";
		public const string INCLUDE_SITES = "sites";
		public const string INCLUDE_ORGANIZATIONS = "organizations";
		public const string INCLUDE_FUNDING_SPACES = "funding_spaces";

		protected readonly HedwigContext _context;

		public HedwigRepository(HedwigContext context) => _context = context;

		public Task SaveChangesAsync()
		{
			return _context.SaveChangesAsync();
		}

		/// <summary>
		/// Updates properties on entity.
		/// Adds, removes, or updates the objects that are
		/// collections accessed via a navigation property
		/// </summary>
		/// <param name="entity"></param>
		/// <typeparam name="T"></typeparam>
		/// <typeparam name="TId"></typeparam>
		public void UpdateHedwigIdEntityWithCollectionNavigationProperties<T, TId>(T entity) where T : IHedwigIdEntity<TId>
		{
			// EF does not automatically update child objects that are collections
			// See https://stackoverflow.com/questions/27176014/how-to-add-update-child-entities-when-updating-a-parent-entity-in-ef
			// See https://stackoverflow.com/questions/11705569/using-the-entrytentity-currentvalues-setvalues-is-not-updating-collections
			// See https://stackoverflow.com/questions/3635071/update-relationships-when-saving-changes-of-ef4-poco-objects/3635326#3635326
			// My only thought on why EF doesn't include code like this is that it requires multiple round trips to the database

			// Retreive the value currently in the database
			var loadedEntity = _context.Find(entity.GetType(), entity.Id);
			// And attach it the context
			var trackedEntity = _context.Attach(loadedEntity);

			// Apply updates to directly accessible properties (reference fks and property values)
			trackedEntity.CurrentValues.SetValues(entity);

			// Get all the navigation properties that are collections
			// We have to apply updates on those objects
			var collectionEntries = trackedEntity.Collections;
			foreach (var collectionEntry in collectionEntries)
			{
				// Load the target objects
				collectionEntry.Load();
				var propertyInfo = collectionEntry.Metadata.PropertyInfo;
				// Get the original values currently in the database
				var originalValues = propertyInfo.GetValue(loadedEntity) as IEnumerable<object>;
				// Get the to-be current values for the incoming entity
				var currentValues = entity.GetType().GetProperty(propertyInfo.Name).GetValue(entity) as IEnumerable<object>;
				if (originalValues != null)
				{
					foreach (var item in originalValues)
					{
						// Delete all entries currently
						collectionEntry.FindEntry(item).State = EntityState.Deleted;
					}
				}
				if (currentValues != null)
				{
					foreach (var item in currentValues)
					{
						var trackedItem = _context.Entry(item);
						// Get the current values for the given item
						var savedItem = trackedItem.GetDatabaseValues();
						// If it doesn't exist, add it to the db
						if (savedItem == null)
						{
							_context.Add(item);
						}
						// Else reset the state from either delete/unchanged to modified
						else
						{
							trackedItem.State = EntityState.Modified;
						}
					}
				}
			}
		}
	}

	public interface IHedwigRepository
	{
		Task SaveChangesAsync();
	}
}
