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
            using( var api = new TestApiProvider()) {
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
                Enrollment enrollmentCurrent = await responseCurrent.ParseGraphQLResponse<Enrollment>();
                Assert.Equal(exit, enrollmentCurrent.Exit);


                var responseAsOf = await api.Client.GetGraphQLAsync(
                    $@"{{
                        enrollment(asOf: ""{asOf}"", id: ""{enrollment.Id}"") {{
                            exit
                        }}
                    }}"
                );

                responseAsOf.EnsureSuccessStatusCode();
                Enrollment enrollmentAsOf = await responseAsOf.ParseGraphQLResponse<Enrollment>();
                Assert.False(enrollmentAsOf.Exit.HasValue);
            }
        }

        [Fact]
        public async Task Get_Enrollment_By_Id_As_Of_With_Child()
        {
            using( var api = new TestApiProvider()) {
                // Given
                var child = ChildHelper.CreateChild(api.Context);
                var enrollment = EnrollmentHelper.CreateEnrollmentWithChildId(api.Context, child.Id);
                var asOf = Utilities.GetAsOfWithSleep();

                var updatedName = "UPDATED";
                child.FirstName =  updatedName;
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
                Enrollment enrollmentCurrent = await responseCurrent.ParseGraphQLResponse<Enrollment>();
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
                Enrollment enrollmentAsOf = await responseAsOf.ParseGraphQLResponse<Enrollment>();
                Assert.Equal(ChildHelper.FIRST_NAME, enrollmentAsOf.Child.FirstName);
            }
        }

        [Fact]
        public async Task Get_Enrollment_By_Id_As_Of_With_Funding()
        {
            using( var api = new TestApiProvider()) {
                // Given
                var enrollment = EnrollmentHelper.CreateEnrollment(api.Context);
                var funding = FundingHelper.CreateFundingWithEnrollmentId(api.Context, enrollment.Id);
                var asOf = Utilities.GetAsOfWithSleep();

                var exit = DateTime.Now.AddDays(3).Date;
                funding.Exit = exit;
                api.Context.SaveChanges();

                // When
                var responseCurrent = await api.Client.GetGraphQLAsync(
                    $@"{{
                        enrollment(id: ""{enrollment.Id}"") {{
                            fundings {{
                                exit
                            }}
                        }}
                    }}"
                );

                responseCurrent.EnsureSuccessStatusCode();
                Enrollment enrollmentCurrent = await responseCurrent.ParseGraphQLResponse<Enrollment>();
                Assert.Single(enrollmentCurrent.Fundings);
                Assert.Equal(exit, enrollmentCurrent.Fundings.First().Exit);
                
                var responseAsOf = await api.Client.GetGraphQLAsync(
                    $@"{{
                        enrollment(asOf: ""{asOf}"", id: ""{enrollment.Id}"") {{
                            fundings {{
                                exit
                            }}
                        }}
                    }}"
                );

                responseAsOf.EnsureSuccessStatusCode();
                Enrollment enrollmentAsOf = await responseAsOf.ParseGraphQLResponse<Enrollment>();
                Assert.Single(enrollmentAsOf.Fundings);
                Assert.False(enrollmentAsOf.Fundings.First().Exit.HasValue);
            }
        }       
    }
}