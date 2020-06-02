using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public abstract class Report : IHedwigIdEntity<int>, INonBlockingValidatableObject
	{
		[Required]
		public int Id { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public FundingSource Type { get; protected set; }

		[Required]
		public int ReportingPeriodId { get; set; }
		// This is okay to require because the user can never change the relationship
		// If you try to require a model property, do so at your own risk.
		// There be dragons.
		[Required]
		[JsonProperty("reportingPeriod")]
		public ReportingPeriod ReportingPeriod { get; protected set; }

		public DateTime? SubmittedAt { get; set; }

		[NotMapped]
		public List<Enrollment> Enrollments { get; set; }
		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
