using System.Collections.Generic;

namespace Hedwig.Models
{
	public class CdcReportOrganizationDTO
	{
		public string Name { get; set; }
		public List<OrganizationSiteDTO> Sites { get; set; }
		public List<FundingSpaceDTO> FundingSpaces { get; set; }
	}
}
