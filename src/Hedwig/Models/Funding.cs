namespace Hedwig.Models
{
	public class Funding : TemporalEntity
	{
		public int Id { get; set; }

		public int EnrollmentId { get; set; }
		public Enrollment Enrollment { get; set; }

		public FundingSource Source { get; set; }
		public FundingTime Time { get; set; }
	}
}
