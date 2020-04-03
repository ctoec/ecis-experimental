using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;
using Hedwig.Validations.Attributes;
using Hedwig.Models.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace Hedwig.Models
{
	public class Funding : TemporalEntity, IHedwigIdEntity<int>, INonBlockingValidatableObject
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public int EnrollmentId { get; set; }
		public Enrollment Enrollment { get; set; }

		public FundingSpace FundingSpace { get; set; }
		public int? FundingSpaceId { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public FundingSource? Source { get; set; }

		// CDC funding fields
		[RequiredForFundingSource(FundingSource.CDC)]
		public int? FirstReportingPeriodId { get; set; }
		[ReadOnly]
		public ReportingPeriod FirstReportingPeriod { get; set; }
		public int? LastReportingPeriodId { get; set; }
		[LastReportingPeriodAfterFirst]
		[ReadOnly]
		public ReportingPeriod LastReportingPeriod { get; set; }
		[RequiredForFundingSource(FundingSource.CDC)]
		[JsonConverter(typeof(StringEnumConverter))]
		public FundingTime? Time { get; set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
