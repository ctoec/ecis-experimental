using Xunit;
using System;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;
using HedwigTests.Helpers;

namespace HedwigTests.Integration.GraphQLQueries
{
    [Collection("SqlServer")]
    public class EnrollmentQueryTests
    {
        [Fact]
        public async Task Get_Enrollment_By_Id_As_Of()
        {
            int? enrollmentId = null;
            DateTime? asOf = null;
            DateTime exit = DateTime.Now.AddDays(3).Date;
            void seedData(HedwigContext context) {
                var enrollment = EnrollmentHelper.CreateEnrollment(context);
                enrollmentId = enrollment.Id;
                asOf = Utilities.GetAsOfWithSleep();

                enrollment.Exit = exit;
                context.SaveChanges();
            }

            using( var client = new TestClientProvider(seedData).Client) {
                var responseCurrent = await client.GetGraphQLAsync(
                    $@"{{
                        enrollment(id: ""{enrollmentId.Value}"") {{
                            exit
                        }}
                    }}"
                );

                responseCurrent.EnsureSuccessStatusCode();
                Enrollment enrollmentCurrent = await responseCurrent.ParseGraphQLResponse<Enrollment>();
                Assert.Equal(exit, enrollmentCurrent.Exit);


                var responseAsOf = await client.GetGraphQLAsync(
                    $@"{{
                        enrollment(asOf: ""{asOf.Value}"", id: ""{enrollmentId.Value}"") {{
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
            int? enrollmentId = null;
            Guid? childId = null;
            DateTime? asOf = null;
            String updatedName = "UPDATED";
            void seedData(HedwigContext context) {
                var child = ChildHelper.CreateChild(context);
                childId = child.Id;
                var enrollment = EnrollmentHelper.CreateEnrollmentWithChildId(context, childId.Value);
                enrollmentId = enrollment.Id;
                asOf = Utilities.GetAsOfWithSleep();

                child.FirstName = updatedName;
                context.SaveChanges();
            }

            using( var client = new TestClientProvider(seedData).Client) {
                var responseCurrent = await client.GetGraphQLAsync(
                    $@"{{
                        enrollment(id: ""{enrollmentId.Value}"") {{
                            child {{
                                firstName
                            }}
                        }}
                    }}"
                );

                responseCurrent.EnsureSuccessStatusCode();
                Enrollment enrollmentCurrent = await responseCurrent.ParseGraphQLResponse<Enrollment>();
                Assert.Equal(updatedName, enrollmentCurrent.Child.FirstName);


                var responseAsOf = await client.GetGraphQLAsync(
                    $@"{{
                        enrollment(asOf: ""{asOf.Value}"", id: ""{enrollmentId.Value}"") {{
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
            int? enrollmentId = null;
            int? fundingId = null;
            DateTime? asOf = null;
            DateTime fundingExit = DateTime.Now.AddDays(3).Date;
            void seedData(HedwigContext context) {
                var enrollment = EnrollmentHelper.CreateEnrollment(context);
                enrollmentId = enrollment.Id;
                var funding = FundingHelper.CreateFundingWithEnrollmentId(context, enrollmentId.Value);
                fundingId = funding.Id;
                asOf = Utilities.GetAsOfWithSleep();

                funding.Exit = fundingExit;
                context.SaveChanges();
            }

            using( var client = new TestClientProvider(seedData).Client) {
                var responseCurrent = await client.GetGraphQLAsync(
                    $@"{{
                        enrollment(id: ""{enrollmentId.Value}"") {{
                            fundings {{
                                exit
                            }}
                        }}
                    }}"
                );

                responseCurrent.EnsureSuccessStatusCode();
                Enrollment enrollmentCurrent = await responseCurrent.ParseGraphQLResponse<Enrollment>();
                Assert.Single(enrollmentCurrent.Fundings);
                Assert.Equal(fundingExit, enrollmentCurrent.Fundings.First().Exit);
                
                var responseAsOf = await client.GetGraphQLAsync(
                    $@"{{
                        enrollment(asOf: ""{asOf.Value}"", id: ""{enrollmentId.Value}"") {{
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