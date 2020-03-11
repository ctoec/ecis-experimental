using System;
using Hedwig.Models.Attributes;

namespace Hedwig.Models
{
	public abstract class TemporalEntity
	{
		[ReadOnly]
		public int? AuthorId { get; set; }
		[ReadOnly]
		public User Author { get; set; }
		[ReadOnly]
		public DateTime? UpdatedAt { get; set; }
	}
}
