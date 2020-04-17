using System.Collections.Generic;

namespace Hedwig.Models
{
	public class OrganizationDTOForRoster
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public ICollection<SiteDTOForRoster> Sites { get; set; }
		public ICollection<FundingSpaceDTOForRoster> FundingSpaces { get; set; }
	}
}
