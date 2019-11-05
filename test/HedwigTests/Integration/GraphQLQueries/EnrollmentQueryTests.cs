using Xunit;
using System;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Integration.GraphQLQueries
{
	public class EnrollmentQueryTests
	{
		[Fact]
		public async Task Get_Enrollment_By_Id_As_Of()
		{
			using (var api = new TestApiProvider())
			{
				//Given 
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context);
				var asOf = Utilities.GetAsOfWithSleep();

				var exit = DateTime.Now.AddDays(3).Date;
				enrollment.Exit = exit;
				api.Context.SaveChanges();

				// When
				var responseCurrent = await api.Client.GetGraphQLAsync(
						$@"{{
                        enrollment(id: ""{enrollment.Id}"") {{
                            exit
                        }}
                    }}"
				);

				responseCurrent.EnsureSuccessStatusCode();
				Enrollment enrollmentCurrent = await responseCurrent.GetObjectFromGraphQLResponse<Enrollment>();
				Assert.Equal(exit, enrollmentCurrent.Exit);


				var responseAsOf = await api.Client.GetGraphQLAsync(
						$@"{{
                        enrollment(asOf: ""{asOf}"", id: ""{enrollment.Id}"") {{
                            exit
                        }}
                    }}"
				);

				responseAsOf.EnsureSuccessStatusCode();
				Enrollment enrollmentAsOf = await responseAsOf.GetObjectFromGraphQLResponse<Enrollment>();
				Assert.False(enrollmentAsOf.Exit.HasValue);
			}
		}

		[Fact]
		public async Task Get_Enrollment_By_Id_As_Of_With_Child()
		{
			using (var api = new TestApiProvider())
			{
				// Given
				var originalName = "FIRST";
				var updatedName = "UPDATED";
				var child = ChildHelper.CreateChild(api.Context, firstName: originalName);
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context, child: child);
				var asOf = Utilities.GetAsOfWithSleep();

				child.FirstName = updatedName;
				api.Context.SaveChanges();

				var responseCurrent = await api.Client.GetGraphQLAsync(
						$@"{{
                        enrollment(id: ""{enrollment.Id}"") {{
                            child {{
                                firstName
                            }}
                        }}
                    }}"
				);

				responseCurrent.EnsureSuccessStatusCode();
				Enrollment enrollmentCurrent = await responseCurrent.GetObjectFromGraphQLResponse<Enrollment>();
				Assert.Equal(updatedName, enrollmentCurrent.Child.FirstName);


				var responseAsOf = await api.Client.GetGraphQLAsync(
						$@"{{
                        enrollment(asOf: ""{asOf}"", id: ""{enrollment.Id}"") {{
                            child {{
                                firstName
                            }}
                        }}
                    }}"
				);

				responseAsOf.EnsureSuccessStatusCode();
				Enrollment enrollmentAsOf = await responseAsOf.GetObjectFromGraphQLResponse<Enrollment>();
				Assert.Equal(originalName, enrollmentAsOf.Child.FirstName);
			}
		}

		[Fact]
		public async Task Get_Enrollment_By_Id_As_Of_With_Funding()
		{
			using (var api = new TestApiProvider())
			{
				// Given
				var enrollment = EnrollmentHelper.CreateEnrollment(api.Context);
				var asOf = Utilities.GetAsOfWithSleep();

				var funding = FundingHelper.CreateFunding(api.Context, enrollment: enrollment);
				api.Context.SaveChanges();

				// When
				var responseCurrent = await api.Client.GetGraphQLAsync(
						$@"{{
                        enrollment(id: ""{enrollment.Id}"") {{
							fundings {{
								id
							}}
                        }}
                    }}"
				);

				responseCurrent.EnsureSuccessStatusCode();
				Enrollment enrollmentCurrent = await responseCurrent.GetObjectFromGraphQLResponse<Enrollment>();
				Assert.Single(enrollmentCurrent.Fundings);

				var responseAsOf = await api.Client.GetGraphQLAsync(
						$@"{{
                        enrollment(asOf: ""{asOf}"", id: ""{enrollment.Id}"") {{
							fundings {{
								id
							}}
                        }}
                    }}"
				);

				responseAsOf.EnsureSuccessStatusCode();
				Enrollment enrollmentAsOf = await responseAsOf.GetObjectFromGraphQLResponse<Enrollment>();
				Assert.Empty(enrollmentAsOf.Fundings);
			}
		}
	}
}