using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Attributes
{
    public class FundingSpaceAgeGroupMatches : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var fundingSpace = value as FundingSpace;

            if (fundingSpace != null) 
            {
                var funding = validationContext.ObjectInstance as Funding;
                var enrollments = validationContext.GetService(typeof(IEnrollmentRepository)) as IEnrollmentRepository;
                var enrollment = funding.Enrollment ?? enrollments.GetEnrollmentById(funding.EnrollmentId);

                // Enrollment must have age group to associate fundings with fundingspaces
                if (!enrollment.AgeGroup.HasValue)
                {
                    return new ValidationResult("Funding with FundingSpace cannot be added to Enrollments without AgeGroup");
                }

                // Enrollment age group must be the same as FundingSpace age group
                if(enrollment.AgeGroup.Value != fundingSpace.AgeGroup)
                {
                    return new ValidationResult("Funding FundingSpace AgeGroup must match Enrollment AgeGroup");
                }
    
            }
            
            return null;
        }
    }
}
