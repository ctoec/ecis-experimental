using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Hedwig.Models;
using Hedwig.Validations;
using HedwigTests.Fixtures;


namespace HedwigTests.Validations
{
	public class EnrollmentValidationTests : IClassFixture<TestStartupFactory>
	{
		private readonly TestStartupFactory _factory;
		public EnrollmentValidationTests(
			TestStartupFactory factory
		)
		{
			_factory = factory;
		}

		[Fact]
		public void EnrollmentControllerOrganizationEnrollmentsGet_ReturnsValidationErrorObject()
		{
			var enrollment = new Enrollment
			{
				Child = new Child
				{
					FirstName = "Test name",
					LastName = "Last name"
				}
			};

			var validator = _factory.Services.GetRequiredService<INonBlockingValidator>();

			validator.Validate(enrollment);

			Assert.NotNull(enrollment.ValidationErrors);
		}
	}
}
