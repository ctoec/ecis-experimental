using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hedwig.Models
{
	public class Funding : TemporalEntity
	{
		public int Id { get; set; }

		public int EnrollmentId { get; set; }
		public Enrollment Enrollment { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public FundingSource Source { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public FundingTime Time { get; set; }
	}
}
