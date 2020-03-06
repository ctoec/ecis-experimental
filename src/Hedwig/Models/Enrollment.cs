using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;
using Hedwig.Validations.Attributes;
using Hedwig.Models.Attributes;

namespace Hedwig.Models
{
	public class Enrollment : TemporalEntity, IHedwigIdEntity<int>, INonBlockingValidatableObject
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public Guid ChildId { get; set; }
		public Child Child { get; set; }

		[Required]
		[SiteIdFromPath]
		public int SiteId { get; set; }
		[ReadOnly]
		public Site Site { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public Age? AgeGroup { get; set; }

		[Column(TypeName = "date")]
		public DateTime? Entry { get; set; }

		[Exit_AfterEntryIfExists]
		[Column(TypeName = "date")]
		public DateTime? Exit { get; set; }

		[ExitReason_RequiredIfExitExists]
		public string ExitReason { get; set; }

		[CDC_Funding_ReportingPeriodsAreValid]
		public ICollection<Funding> Fundings { get; set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
