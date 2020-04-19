using System.Collections.Generic;

namespace Hedwig.Models
{
	public class EnrollmentSummaryOrganizationDTO
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public ICollection<EnrollmentSummarySiteDTO> Sites { get; set; }
		public ICollection<FundingSpaceDTO> FundingSpaces { get; set; }
	}
}
