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
		/// Updates an entity entry in the db context.
		/// </summary>
		/// <param name="entity">The entity to update in the DB</param>
		/// <param name="entityDTO">The entity, as the appropriate DTO to control for cyclical references</param>
		/// <typeparam name="TEntity">The entity type</typeparam>
		/// <typeparam name="TDto">The entity DTO type</typeparam>
		/// <typeparam name="TId"></typeparam>
		public void UpdateHedwigIdEntityWithCollectionNavigationProperties<TEntity, TDto, TId>(TEntity entity, TDto entityDTO) 
			where TEntity : IHedwigIdEntity<TId> 
			where TDto : IHedwigIdEntity<TId>
		{
			// Retreive the value currently in the database
			var loadedEntity = _context.Find(entity.GetType(), entity.Id);
			// And attach it the context
			var trackedEntry = _context.Attach(loadedEntity);

			// Apply updates to directly accessible properties (reference fks and property values)
			trackedEntry.CurrentValues.SetValues(entityDTO);

			// Recursively update all navigation properties
			UpdateNavigationProperties(trackedEntry, loadedEntity, entity, entityDTO);
		}

		/// <summary>
		/// Recursively updates all navigation properties on an EntityEntry,
		/// both reference and navigation.
		/// </summary>
		/// <param name="trackedEntity">The tracked EntityEntry to update reference navigation properites on</param>
		/// <param name="loadedEntity">The loaded entity values for the trackedEntity, from the DB</param>
		/// <param name="incomingEntity">The incoming entity values for the trackedEntity, from the request</param>
		/// <param name="incomingEntityDTO">The incoming entity values for the trackedEntity, as the appropriate DTO</param>
		private void UpdateNavigationProperties(EntityEntry trackedEntry, object loadedEntity, object incomingEntity, object incomingEntityDTO)
		{
			UpdateReferenceNavigationProperties(trackedEntry, loadedEntity, incomingEntity, incomingEntityDTO);
			UpdateCollectionNavigationProperties(trackedEntry, loadedEntity, incomingEntity, incomingEntityDTO);
		}

		/// <summary>
		/// Recursively updates reference navigation properties.
		/// Sets FK relationships as necessary; either adding parent entity Id
		/// to navigation child entity FK, or adding child entity to navigation
		/// parent entity reference.
		/// </summary>
		/// <param name="trackedEntity">The tracked EntityEntry to update reference navigation properites on</param>
		/// <param name="loadedEntity">The loaded entity values for the trackedEntity, from the DB</param>
		/// <param name="incomingEntity">The incoming entity values for the trackedEntity, from the request</param>
		/// <param name="incomingEntityDTO">The incoming entity values for the trackedEntity, as the appropriate DTO</param>
		private void UpdateReferenceNavigationProperties(EntityEntry trackedEntity, object loadedEntity, object incomingEntity, object incomingEntityDTO)
		{
			var referenceEntries = trackedEntity.References;
			foreach (var referenceEntry in referenceEntries)
			{
				referenceEntry.Load();

				var propertyInfo = referenceEntry.Metadata.PropertyInfo;
				var currentDTOValue = incomingEntityDTO.GetType().GetProperty(propertyInfo.Name)?.GetValue(incomingEntityDTO);
				var currentValue = incomingEntity.GetType().GetProperty(propertyInfo.Name).GetValue(incomingEntity);

				// If there is an incoming value
				if(currentDTOValue != null)
				{
					// If there is not an orginal value, loaded from DB
					if(referenceEntry.TargetEntry == null)
					{

						// If the current entity is the FK declaring entity
						if (referenceEntry.Metadata.ForeignKey.DeclaringEntityType.ClrType == currentValue.GetType())
						{
							// Then get principal FK id from parent 
							var parentFkProp = referenceEntry.Metadata.ForeignKey.PrincipalKey.Properties.First();
							var fkValue = parentFkProp.PropertyInfo.GetValue(referenceEntry.EntityEntry.Entity);

							// And add to current child navigation entity
							var dependentFkProp = referenceEntry.Metadata.ForeignKey.Properties
								.FirstOrDefault(prop => prop.PropertyInfo.DeclaringType == currentValue.GetType());
							dependentFkProp.PropertyInfo.SetValue(currentValue, fkValue);
						}

						// Add entity
						_context.Add(currentValue);

						// If the parent entity is the FK declaring entity
						if (referenceEntry.Metadata.ForeignKey.DeclaringEntityType.ClrType == referenceEntry.EntityEntry.Entity.GetType())
						{
							// Then add the child entity mapping to the parent navigation entity
							var declaringParentReferenceProp = referenceEntry.Metadata.ForeignKey.DependentToPrincipal.PropertyInfo;
							declaringParentReferenceProp.SetValue(referenceEntry.EntityEntry.Entity, currentValue);
						}
					}
					// Otherwise, update the existing entity
					else
					{
						var originalValue = propertyInfo.GetValue(loadedEntity);
						referenceEntry.TargetEntry.OriginalValues.SetValues(originalValue);
						referenceEntry.TargetEntry.CurrentValues.SetValues(currentDTOValue);

						// And recursively update entity navigation properties
						UpdateNavigationProperties(referenceEntry.TargetEntry, originalValue, currentValue, currentDTOValue);
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
		/// <param name="loadedEntity">The loaded entity values for the trackedEntity, from the DB</param>
		/// <param name="incomingEntity">The incoming entity values for the trackedEntity, from the request</param>
		/// <param name="incomingEntityDTO">The incoming entity values for the trackedEntity, as the appropriate DTO</param>
		private void UpdateCollectionNavigationProperties(EntityEntry trackedEntity, object loadedEntity, object incomingEntity, object incomingEntityDTO)
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
					var originalValues = propertyInfo.GetValue(loadedEntity) as IEnumerable<object>;

					// Set all existing items to 'Deleted'
					if (originalValues != null)
					{
						foreach (var item in originalValues)
						{
							collectionEntry.FindEntry(item).State = EntityState.Deleted;
						}
					}

					// Update existing items with current items
					foreach (var item in currentValues)
					{
						// Load original value from DB
						var trackedItem = _context.Entry(item);
						var dbValues = trackedItem.GetDatabaseValues();

						// If there is not an original value
						if (dbValues == null)
						{
							// Add principal FK id from parent
							var parentFkProp = collectionEntry.Metadata.ForeignKey.PrincipalKey.Properties.First();
							var fkValue = parentFkProp.PropertyInfo.GetValue(collectionEntry.EntityEntry.Entity);

							// To current child navigation entity
							var dependentFkProp = collectionEntry.Metadata.ForeignKey.Properties
								.First(prop => prop.PropertyInfo.DeclaringType == item.GetType());
							dependentFkProp.PropertyInfo.SetValue(item, fkValue);
							_context.Add(item);
						}
						// Otherwise, update the existing entity
						else
						{
							var attachedItem = _context.Attach(trackedItem.Entity);
							attachedItem.OriginalValues.SetValues(dbValues);
							var itemDTO = currentDTOValues.First(currentDTOValue => IdEquals(currentDTOValue, item));
							attachedItem.CurrentValues.SetValues(itemDTO);

							// And recursively update entity navigation properties
							// UpdateNavigationProperties(trackedItem, dbValues, item, itemDTO);
						}
					}
				}
	   	}
		}

		private bool IdEquals(object a, object b)
		{
			var aIdProp = a.GetType().GetProperty("Id");
			var bIdProp = b.GetType().GetProperty("Id");

			if(aIdProp == null || bIdProp == null || aIdProp.PropertyType != bIdProp.PropertyType)
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
