using System.Collections.Generic;
using System;

namespace Hedwig.Validations
{
	public class NonBlockingValidationContext
	{
		public IDictionary<Type, object> ParentEntities { get; private set; }

		public NonBlockingValidationContext()
		{
			ParentEntities = new Dictionary<Type, object>();
		}

		/// <summary>
		/// Adds an object to the ParentEntities dictionary, keyed by type.
		/// If an entry exists with the given type key, it is overwritten.
		/// </summary>
		/// <param name="parentEntity"></param>
		public void AddParentEntity(object parentEntity)
		{
			if (parentEntity != null)
			{
				ParentEntities[parentEntity.GetType()] = parentEntity;
			}
		}

		/// <summary>
		/// Returns the ParentEntities dictionary entry for the given type key,
		/// or null of none exists.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <returns></returns>
		public T GetParentEntity<T>()
		{
			object value = null;
			ParentEntities.TryGetValue(typeof(T), out value);
			return (T)value;
		}

		/// <summary>
		/// Removes entry with key of Type T from ParentEntities dictionary.
		/// Returns the result of the Dictionary.Remove() call.
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <returns></returns>
		public bool RemoveParentEntity<T>()
		{
			return ParentEntities.Remove(typeof(T));
		}
	}
}
