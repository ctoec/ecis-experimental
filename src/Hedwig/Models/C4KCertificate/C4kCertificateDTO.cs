using System;
using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class C4KCertificateDTO
	{
		public int Id { get; set; }
		public Guid ChildId { get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? EndDate { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
