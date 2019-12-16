using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;
using Hedwig.Validations.Attributes;

namespace Hedwig.Models
{
	public class Enrollment : TemporalEntity, INonBlockingValidatableObject
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public Guid ChildId { get; set; }
		public Child Child { get; set; }

		[Required]
		[SiteIdFromPath]
		public int SiteId { get; set; }
		public Site Site { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public Age? Age { get; set; }

		public DateTime? Entry { get; set; }

		public DateTime? Exit { get; set; }

		public ICollection<Funding> Fundings { get; set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
