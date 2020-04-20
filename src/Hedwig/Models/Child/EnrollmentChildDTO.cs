using System;
using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class EnrollmentChildDTO
	{
		public Guid Id { get; set; }
		public string Sasid { get; set; }
		public string FirstName { get; set; }
		public string MiddleName { get; set; }
		public string LastName { get; set; }
		public string Suffix { get; set; }
		public DateTime? Birthdate { get; set; }
		public string BirthTown { get; set; }
		public string BirthState { get; set; }
		public string BirthCertificateId { get; set; }
		public bool AmericanIndianOrAlaskaNative { get; set; }
		public bool Asian { get; set; }
		public bool BlackOrAfricanAmerican { get; set; }
		public bool NativeHawaiianOrPacificIslander { get; set; }
		public bool White { get; set; }
		public bool? HispanicOrLatinxEthnicity { get; set; }
		public Gender Gender { get; set; }
		public bool Foster { get; set; }
		public int? FamilyId { get; set; }
		public EnrollmentFamilyDTO Family { get; set; }
		public int OrganizationId { get; set; }
		public int? C4KFamilyCaseNumber { get; set; }
		public List<C4KCertificate> C4KCertificates { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
