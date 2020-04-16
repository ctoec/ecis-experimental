using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
    public class FundingSpaceOrganizationMatches : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var fundingSpace = value as FundingSpace;
            
            if (fundingSpace != null)
            {
                var funding = validationContext.ObjectInstance as Funding;
                var enrollments = validationContext.GetService(typeof(IEnrollmentRepository)) as IEnrollmentRepository;
                var enrollment = funding.Enrollment ?? enrollments.GetEnrollmentByIdAsNoTracking(funding.EnrollmentId);

                // FundingSpace organizationId must be the same as Enrollment's Site organizationId
                var sites = validationContext.GetService(typeof(ISiteRepository)) as ISiteRepository;
                var site = enrollment.Site ?? sites.GetSiteByIdAsNoTracking(enrollment.SiteId);
                if (fundingSpace.OrganizationId != site.OrganizationId)
                {
                    return new ValidationResult("Funding FundingSpace must belong to the same Organization as Enrollment Site");
                }
            }

            return null;
        }
    }
}