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
		/// Updates an entity entry in the db context, setting entity states to modified only if
		/// an entity has changes (to directly accessible properties, or any navigation properties).
		/// 
		/// This is desirable over the behavior of DbContext.Update() (which updates the state of the 
		/// entity and all reference navigation properties update regardless of if any values 
		/// actually change) because we rely on entity State to determine when temporal entity 
		/// metadata (AuthorId and UpdatedAt timestamp) should be updated.
		/// </summary>
		/// <param name="entity">The entity to update in the DB</param>
		/// <param name="entityDTO">The entity, as the appropriate DTO to control for cyclical references</param>
		/// <typeparam name="TEntity">The entity type</typeparam>
		/// <typeparam name="TDto">The entity DTO type</typeparam>
		/// <typeparam name="TId"></typeparam>
		public void UpdateHedwigIdEntityWithNavigationProperties<TEntity, TDto, TId>(TEntity entity, TDto entityDTO)
			where TEntity : IHedwigIdEntity<TId>
			where TDto : IHedwigIdEntity<TId>
		{
			// Attach the entity from DB to context
			var trackedEntry = _context.Attach(
				_context.Find(entity.GetType(), entity.Id)
			);

			// Apply updates to directly accessible properties (reference fks and property values)
			trackedEntry.CurrentValues.SetValues(entityDTO);

			// Recursively update all navigation properties
			UpdateNavigationProperties(trackedEntry, entity, entityDTO);
		}

		/// <summary>
		/// Recursively updates all navigation properties on an EntityEntry,
		/// both reference and navigation. Returns a boolean indicating if 
		/// _any_ navigation properties were modified (including recursive navigation property updates)
		/// </summary>
		/// <param name="trackedEntity">The tracked EntityEntry to update reference navigation properites on</param>
		/// <param name="currentEntity">The incoming entity values for the trackedEntity, from the request</param>
		/// <param name="currentEntityDTO">The incoming entity values for the trackedEntity, as the appropriate DTO</param>
		private void UpdateNavigationProperties(EntityEntry trackedEntry, object currentEntity, object currentEntityDTO)
		{
			UpdateReferenceNavigationProperties(trackedEntry, currentEntity, currentEntityDTO);
			UpdateCollectionNavigationProperties(trackedEntry, currentEntity, currentEntityDTO);
			// return referencesUpdated || collectionsUpdated;
		}

		/// <summary>
		/// Recursively updates reference navigation properties.
		/// Sets FK relationships as necessary; either adding parent entity Id
		/// to navigation child entity FK, or adding child entity to navigation
		/// parent entity reference.
		/// </summary>
		/// <param name="trackedEntity">The tracked EntityEntry to update reference navigation properites on</param>
		/// <param name="currentEntity">The incoming entity values for the trackedEntity, from the request</param>
		/// <param name="currentEntityDTO">The incoming entity values for the trackedEntity, as the appropriate DTO</param>
		private void UpdateReferenceNavigationProperties(EntityEntry trackedEntity, object currentEntity, object currentEntityDTO)
		{
			var referenceEntries = trackedEntity.References;
			foreach (var referenceEntry in referenceEntries)
			{
				referenceEntry.Load();

				var propertyInfo = referenceEntry.Metadata.PropertyInfo;
				var currentDTOValue = currentEntityDTO.GetType().GetProperty(propertyInfo.Name)?.GetValue(currentEntityDTO);
				var currentValue = currentEntity.GetType().GetProperty(propertyInfo.Name).GetValue(currentEntity);

				// If there is an incoming value
				if (currentDTOValue != null)
				{
					// If there is not an orginal value, loaded from DB
					if (referenceEntry.TargetEntry == null)
					{
						referenceEntry.CurrentValue = currentValue;
					}
					// Otherwise, update the existing entity
					else
					{
						var originalValue = propertyInfo.GetValue(trackedEntity.Entity);
						referenceEntry.TargetEntry.OriginalValues.SetValues(originalValue);
						referenceEntry.TargetEntry.CurrentValues.SetValues(currentDTOValue);

						// And recursively update entity navigation properties
						UpdateNavigationProperties(referenceEntry.TargetEntry, currentValue, currentDTOValue);

						// If 
						if (referenceEntry.TargetEntry.State == EntityState.Modified)
						{
							referenceEntry.EntityEntry.State = EntityState.Modified;
						}
					}
				}
			}
		}
		/// <summary>
		/// Recursively updates collection navigation properties.
		/// Adds, updates, or removes items in the collection.
		/// If adding, also sets FK relationship adding parent entity Id
		/// to navigation child entity FK.
		/// </summary>
		/// <param name="trackedEntity">The tracked EntityEntry to update reference navigation properites on</param>
		/// <param name="incomingEntity">The incoming entity values for the trackedEntity, from the request</param>
		/// <param name="incomingEntityDTO">The incoming entity values for the trackedEntity, as the appropriate DTO</param>
		private void UpdateCollectionNavigationProperties(EntityEntry trackedEntity, object incomingEntity, object incomingEntityDTO)
		{
			// EF does not automatically update child objects that are collections
			// See https://stackoverflow.com/questions/27176014/how-to-add-update-child-entities-when-updating-a-parent-entity-in-ef
			// See https://stackoverflow.com/questions/11705569/using-the-entrytentity-currentvalues-setvalues-is-not-updating-collections
			// See https://stackoverflow.com/questions/3635071/update-relationships-when-saving-changes-of-ef4-poco-objects/3635326#3635326
			// My only thought on why EF doesn't include code like this is that it requires multiple round trips to the database

			var collectionEntries = trackedEntity.Collections;
			foreach (var collectionEntry in collectionEntries)
			{
				// Load the target objects
				collectionEntry.Load();

				// Get the current values from the incoming entity
				var propertyInfo = collectionEntry.Metadata.PropertyInfo;
				var currentDTOValues = incomingEntityDTO.GetType().GetProperty(propertyInfo.Name)?.GetValue(incomingEntityDTO) as IEnumerable<object>;
				var currentValues = incomingEntity.GetType().GetProperty(propertyInfo.Name).GetValue(incomingEntity) as IEnumerable<object>;

				// If there is an incoming value
				if (currentDTOValues != null)
				{
					// Get the original values currently in the database
					// var originalValues = propertyInfo.GetValue(loadedEntity) as IEnumerable<object>;
					var originalValues = propertyInfo.GetValue(trackedEntity.Entity) as IEnumerable<object>;

					if (originalValues != null)
					{
						// Set all original item entry states to 'Deleted'
						foreach (var item in originalValues)
						{
							collectionEntry.FindEntry(item).State = EntityState.Deleted;
						}

						// Update original items from current DTO values
						foreach (var currentItem in currentValues)
						{
							// If there is not an existing original item with the same Id as the currentItem,
							// then add the principal FK Id to the currentItem, and add it to the DB
							var originalItem = originalValues.Where(originalValue => IdEquals(originalValue, currentItem)).FirstOrDefault();
							if (originalItem == null)
							{
								var entry = _context.Attach(currentItem);
								entry.Reference(collectionEntry.Metadata.ForeignKey.DependentToPrincipal.Name).CurrentValue = collectionEntry.EntityEntry.Entity;
							}
							// Otherwise, update the existing entity
							else
							{
								var entry = collectionEntry.FindEntry(originalItem);
								entry.State = EntityState.Unchanged;
								entry.OriginalValues.SetValues(originalItem);
								var itemDTO = currentDTOValues.First(currentDTOValue => IdEquals(currentDTOValue, currentItem));
								entry.CurrentValues.SetValues(itemDTO);

								if(entry.State == EntityState.Modified)
								{
									collectionEntry.EntityEntry.State = EntityState.Modified;
								}

								// And recursively update entity navigation properties
								// UpdateNavigationProperties(trackedItem, dbValues, item, itemDTO);
							}
						}
					}
				}
			}
		}

		///<summary>
		/// Helper function to compare entity corresponding entityDTO objects.
		/// Both should always have comparable Id properties, but to keep the
		/// repository update functions type-agnostic, that is not known at
		/// compile tim
		/// </summary>
		private bool IdEquals(object a, object b)
		{
			var aIdProp = a.GetType().GetProperty("Id");
			var bIdProp = b.GetType().GetProperty("Id");

			if (aIdProp == null || bIdProp == null || aIdProp.PropertyType != bIdProp.PropertyType)
			{
				return false;
			}

			return aIdProp.GetValue(a).Equals(bIdProp.GetValue(b));
		}
	}

	public interface IHedwigRepository
	{
		Task SaveChangesAsync();
	}
}
