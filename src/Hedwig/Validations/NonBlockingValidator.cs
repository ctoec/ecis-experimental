using System;
using System.Collections.Generic;
using Hedwig.Validations.Rules;
using Microsoft.Extensions.DependencyInjection;

namespace Hedwig.Validations
{
	public class NonBlockingValidator : INonBlockingValidator
	{
		readonly IServiceProvider _serviceProvider;

		public NonBlockingValidator(IServiceProvider serviceProvider)
		{
			_serviceProvider = serviceProvider;
		}

		public void Validate<T>(T entity, object parentEntity = null) where T : INonBlockingValidatableObject
		{
			if (entity == null)
			{
				return;
			}

			var rules = _serviceProvider.GetServices<IValidationRule<T>>();
			var errors = new List<ValidationError>();

			var validationContext = new NonBlockingValidationContext(parentEntity);
			foreach (var rule in rules)
			{
				var error = rule.Execute(entity, validationContext);
				if (error != null) errors.Add(error);
			}

			entity.ValidationErrors = errors;
		}

		public void Validate<T>(IEnumerable<T> entities, object parentEntity = null) where T : INonBlockingValidatableObject
		{
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
