using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class C4KCertificate : IHedwigIdEntity<int>, INonBlockingValidatableObject
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public Guid ChildId { get; set; }

		public Child Child { get; set; }

		public DateTime? StartDate { get; set; }

		public DateTime? EndDate { get; set; }

		[NotMapped]
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
