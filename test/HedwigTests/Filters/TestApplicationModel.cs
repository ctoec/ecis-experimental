using Hedwig.Models.Attributes;

namespace HedwigTests.Hedwig.Models
{
	public class ApplicationModel
	{
		[ReadOnly]
		public object ReadOnlyProperty { get; set; }
		public ApplicationModel ChildApplicationModel { get; set; }
	}
}
