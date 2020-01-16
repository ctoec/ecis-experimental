using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Hedwig.Validations;
using Hedwig.Validations.Attributes;
using Hedwig.Repositories;
using Microsoft.AspNetCore.Http;

namespace Hedwig.Models
{
	public class Child : TemporalEntity, IHedwigIdEntity<Guid>, INonBlockingValidatableObject
	{
		[Required]
		public Guid Id { get; set; }

		public string Sasid { get; set; }

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
		public DateTime? Birthdate { get; set; }
		public string BirthTown { get; set; }
		public string BirthState { get; set; }
		public string BirthCertificateId { get; set; }
		public bool AmericanIndianOrAlaskaNative { get; set; } = false;
		public bool Asian { get; set; } = false;
		public bool BlackOrAfricanAmerican { get; set; } = false;
		public bool NativeHawaiianOrPacificIslander { get; set; } = false;
		public bool White { get; set; } = false;
		public bool? HispanicOrLatinxEthnicity { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public Gender Gender { get; set; } = Gender.Unspecified;
		public bool Foster { get; set; } = false;
		public int? FamilyId { get; set; }
		public Family Family { get; set; }
		public ICollection<Enrollment> Enrollments { get; set; }

		[Required]
		[OrgIdFromPath]
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }

		[NotMapped]	
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
