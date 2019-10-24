using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class Child : TemporalEntity
	{
		public Guid Id { get; set; }

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

		public DateTime Birthdate { get; set; }

		public Gender Gender { get; set; }

		public bool? AmericanIndianOrAlaskaNative { get; set; }
		public bool? Asian { get; set; }
		public bool? BlackOrAfricanAmerican { get; set; }
		public bool? NativeHawaiianOrPacificIslander { get; set; }
		public bool? White { get; set; }
		public bool? HispanicOrLatinxEthnicity { get; set; }

		public int? FamilyId { get; set; }
		public Family Family { get; set; }

		public ICollection<Enrollment> Enrollments { get; set; }
	}
}
