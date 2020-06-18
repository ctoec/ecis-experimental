using System.Collections.Generic;
using Hedwig.Validations;

namespace HedwigTests.Validations
{

	public class TestValidatableEntity : INonBlockingValidatableObject
	{
		public string FieldName { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
