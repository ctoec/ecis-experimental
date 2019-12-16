using System;
using System.Collections.Generic;
using Hedwig.Validations.Rules;
using Microsoft.Extensions.DependencyInjection;

namespace Hedwig.Validations
{
  public class Validator : IValidator
  {
    readonly IServiceProvider _serviceProvider;

    public Validator(IServiceProvider serviceProvider)
    {
      _serviceProvider = serviceProvider;
    }

    public void Validate<T>(T entity) where T : INonBlockingValidatableObject
    {
      var rules = _serviceProvider.GetServices<IValidationRule<T>>();
      var errors = new List<ValidationError>();
      foreach (var rule in rules)
      {
        var error = rule.Execute(entity);
        if(error != null) errors.Add(error);
      }

      entity.ValidationErrors = errors;
    }
  }

  public interface IValidator {
    void Validate<T>(T entity) where T : INonBlockingValidatableObject;
  }
}