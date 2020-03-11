namespace Hedwig.Validations
{
	public class NonBlockingValidationContext
	{
		public object ParentEntity { get; private set; }

		public NonBlockingValidationContext(object parentEntity = null)
		{
			ParentEntity = parentEntity;
		}
	}
}
