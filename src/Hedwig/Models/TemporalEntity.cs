using System;

namespace Hedwig.Models
{
	public abstract class TemporalEntity
	{
		public int? AuthorId { get; protected set; }
		public User Author { get; protected set; }
		public DateTime? UpdatedAt { get; protected set; }

		public void UpdateTemporalInfo(int? authorId, DateTime? now)
		{
			this.AuthorId = authorId;
			this.UpdatedAt = now;
		}
	}
}
