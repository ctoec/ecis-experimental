using Hedwig.Data;
using Hedwig.Models;
using System.Collections.Generic;
using System.Linq;

namespace Hedwig.Repositories
{
	public class FundingSpaceRepository : HedwigRepository, IFundingSpaceRepository
	{
		public FundingSpaceRepository(HedwigContext context) : base(context) { }

		public FundingSpace GetById(int id)
		{
			return _context.FundingSpaces
				.FirstOrDefault(space => space.Id == id);
		}

		public FundingSpaceDTO GetFundingSpaceDTOById(int? id)
		{
			return !id.HasValue ? null : _context.FundingSpaces
				.Select(fs => new FundingSpaceDTO()
				{
					Id = fs.Id,
					Capacity = fs.Capacity,
					OrganizationId = fs.OrganizationId,
					Source = fs.Source,
					AgeGroup = fs.AgeGroup,
					Time = fs.Time,
					TimeSplit = fs.TimeSplit
				})
				.FirstOrDefault(space => space.Id == id.Value);
		}
		public ICollection<FundingSpaceDTO> GetFundingSpaceDTOsForOrganiation(int organiationId)
		{
			return _context.FundingSpaces
				.Select(fs => new FundingSpaceDTO()
				{
					Id = fs.Id,
					Capacity = fs.Capacity,
					OrganizationId = fs.OrganizationId,
					Source = fs.Source,
					AgeGroup = fs.AgeGroup,
					Time =fs.Time,
					TimeSplit = fs.TimeSplit
				})
				.Where(fs => fs.OrganizationId == organiationId)
				.ToList();
		}
	}

	public interface IFundingSpaceRepository : IHedwigRepository
	{
		FundingSpace GetById(int id);
		FundingSpaceDTO GetFundingSpaceDTOById(int? id);
		public ICollection<FundingSpaceDTO> GetFundingSpaceDTOsForOrganiation(int organiationId);
	}
}
