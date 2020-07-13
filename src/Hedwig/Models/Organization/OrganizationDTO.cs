using System.Collections.Generic;

namespace Hedwig.Models
{
	public class OrganizationDTO
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public List<SiteDTO> Sites { get; set; }
		public List<FundingSpaceDTO> FundingSpaces { get; set; }
	}
}
