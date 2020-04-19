using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class Organization : IHedwigIdEntity<int>
	{
		[Required]
		public int Id { get; set; }

		[Required]
		[StringLength(100)]
		public string Name { get; set; }

		public ICollection<Site> Sites { get; set; }

		public ICollection<OrganizationReport> Reports { get; set; }

		public ICollection<FundingSpace> FundingSpaces { get; set; }
	}
}
