using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class Enrollment : TemporalEntity, IValidatableObject
	{
		public int Id { get; set; }

		public Guid ChildId { get; set; }
		public Child Child { get; set; }

		public int SiteId { get; set; }
		public Site Site { get; set; }

		public Age? Age { get; set; }

		public DateTime? Entry { get; set; }

		public DateTime? Exit { get; set; }

		public ICollection<Funding> Fundings { get; set; }

		public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
		{
			if (Entry.HasValue && Exit.HasValue && Entry.Value.CompareTo(Exit.Value) >= 0)
			{
				yield return new ValidationResult(
					$"Exit cannot be before Entry",
					new [] {nameof(Exit)}
				);
			}
		}
	}
}
