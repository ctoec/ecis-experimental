using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class CdcReportEnrollmentDTO
	{
		public Age AgeGroup { get; set; }
		public List<FundingDTO> Fundings { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
