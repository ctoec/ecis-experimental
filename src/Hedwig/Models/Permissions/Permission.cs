using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public abstract class Permission : IHedwigIdEntity<int>
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public int UserId { get; set; }
		public User User { get; set; }
	}
}
