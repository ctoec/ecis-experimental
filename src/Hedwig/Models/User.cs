using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hedwig.Models
{
	public class User : IHedwigIdEntity<int>
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public Guid WingedKeysId { get; set; }

		[Required]
		[StringLength(35)]
		public string FirstName { get; set; }

		[StringLength(35)]
		public string MiddleName { get; set; }

		[Required]
		[StringLength(35)]
		public string LastName { get; set; }

		[StringLength(10)]
		public string Suffix { get; set; }

		public ICollection<OrganizationPermission> OrgPermissions { get; set; }
		public ICollection<SitePermission> SitePermissions { get; set; }

		[NotMapped]
		public ICollection<Site> Sites { get; set; }
	}
}
