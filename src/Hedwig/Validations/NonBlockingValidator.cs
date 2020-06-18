using System;
using System.Collections.Generic;
using Hedwig.Validations.Rules;
using Microsoft.Extensions.DependencyInjection;

namespace Hedwig.Validations
{
	public class NonBlockingValidator : INonBlockingValidator
	{
		readonly NonBlockingValidationContext _validationContext;
		readonly IServiceProvider _serviceProvider;

		public NonBlockingValidator(IServiceProvider serviceProvider)
		{
			_serviceProvider = serviceProvider;
			_validationContext = new NonBlockingValidationContext();
		}

		public void Validate<T>(T entity, object parentEntity = null) where T : INonBlockingValidatableObject
		{
			if (entity == null)
			{
				return;
			}

			var ruleType = typeof(IValidationRule<>).MakeGenericType(entity.GetType());
			var rules = _serviceProvider.GetServices(ruleType);
			var errors = new List<ValidationError>();

			_validationContext.AddParentEntity(parentEntity);
			foreach (var rule in rules)
			{
				// rule is of type `ruleType`, but due to compile-time type limitations it is only known to be of type `object`.
				// Use reflection to access the Execute method known to exist on all `IValidationRule<>`s & invoke it.
				var executeFunc = rule.GetType().GetMethod(nameof(IValidationRule<INonBlockingValidatableObject>.Execute));
				var error = (ValidationError)executeFunc.Invoke(rule, new object[] { entity, _validationContext });
				if (error != null) errors.Add(error);
			}

			_validationContext.RemoveParentEntity<T>();

			entity.ValidationErrors = errors;
		}

		public void Validate<T>(IEnumerable<T> entities, object parentEntity = null) where T : INonBlockingValidatableObject
		{
			if (null == entities)
			{
				Validate(null as IEnumerable<T>, parentEntity);
				return;
			}
			foreach (var entity in entities)
			{
				Validate(entity, parentEntity);
			}
		}
	}

	public interface INonBlockingValidator
	{
		void Validate<T>(T entity, object parentEntity = null) where T : INonBlockingValidatableObject;
		void Validate<T>(IEnumerable<T> entities, object parentEntity = null) where T : INonBlockingValidatableObject;
	}
}
