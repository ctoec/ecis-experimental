using System;
using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class ChildDTOForRoster
	{
		public Guid Id { get; set; }
		public string Sasid { get; set; }
		public string FirstName { get; set; }
		public string MiddleName { get; set; }
		public string LastName { get; set; }
		public string Suffix { get; set; }
		public DateTime? Birthdate { get; set; }
		public List<C4KCertificate> C4KCertificates { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
