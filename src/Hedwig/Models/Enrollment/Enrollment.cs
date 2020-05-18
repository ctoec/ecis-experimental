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
		[JsonProperty("site")]
		public Site Site { get; protected set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public Age? AgeGroup { get; set; }

		[Column(TypeName = "date")]
		public DateTime? Entry { get; set; }

		[Exit_AfterEntryIfExists]
		[Column(TypeName = "date")]
		public DateTime? Exit { get; set; }

		[ExitReason_RequiredIfExitExists]
		public string ExitReason { get; set; }

		[Fundings_ReportingPeriodsAreValid]
		[Fundings_FundingSpacesAreValid]
		public ICollection<Funding> Fundings { get; set; }

		[NotMapped]
		public ICollection<Enrollment> PastEnrollments { get; set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
