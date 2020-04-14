using Hedwig.Models.Attributes;
using System.Collections.Generic;

namespace HedwigTests.Hedwig.Models
{
	public class ApplicationModel
	{
		[ReadOnly]
		public object ReadOnlyProperty { get; set; }
		public ICollection<ApplicationModel> ChildApplicationModels { get; set; }
	}
}
