using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;
using Hedwig.Validations.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


namespace Hedwig.Models
{
	public class Funding : TemporalEntity, IHedwigIdEntity<int>, INonBlockingValidatableObject
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public int EnrollmentId { get; set; }
		public Enrollment Enrollment { get; set; }

		// NOTE: validations for fundingSpace are defined at the enrollment level
		// due to need to access enrollment-level fields (ageGroup, site)
		public FundingSpace FundingSpace { get; protected set; }

		[Required]
		public int? FundingSpaceId { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		[FundingSpaceSourceMatches]
		public FundingSource? Source { get; set; }

		// CDC funding fields
		[RequiredForFundingSource(FundingSource.CDC)]
		public int? FirstReportingPeriodId { get; set; }
		public ReportingPeriod FirstReportingPeriod { get; protected set; }
		public int? LastReportingPeriodId { get; set; }
		[LastReportingPeriodAfterFirst]
		public ReportingPeriod LastReportingPeriod { get; protected set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
