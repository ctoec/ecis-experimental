using System;

namespace ecis2.Models
{
	public class Funding
	{
		public int Id { get; set; }

		public int EnrollmentId { get; set; }
		public Enrollment Enrollment { get; set; }

		public FundingSource Source { get; set; }

		public DateTime Entry { get; set; }

		public DateTime? Exit { get; set; }
	}
}
