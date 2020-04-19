namespace Hedwig.Models
{
	public class OrganizationSiteDTO
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public bool TitleI { get; set; } = false;
		public Region Region { get; set; }
		public int OrganizationId { get; set; }
		public int? FacilityCode { get; set; }
		public int? LicenseNumber { get; set; }
		public int? NaeycId { get; set; }
		public int? RegistryId { get; set; }
	}
}
