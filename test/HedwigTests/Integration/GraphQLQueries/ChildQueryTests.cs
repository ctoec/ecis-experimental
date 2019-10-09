using Xunit;
using System;
using System.Threading.Tasks;
using Hedwig.Data;
using HedwigTests.Helpers;
using Hedwig.Models;

namespace HedwigTests.Integration.GraphQLQueries
{
    [Collection("SqlServer")]
    public class ChildQueryTests
    {
        [Fact]
        public async Task Get_Child_By_Id_As_Of()
        {
            // Given
            Guid? childId = null;
            DateTime? asOf = null;
            string updatedName = "UPDATED";
            void seedData(HedwigContext context) {
                var child = ChildHelper.CreateChild(context);
                childId = child.Id;
                asOf = Utilities.GetAsOfWithSleep();
                child.FirstName = updatedName;
                context.SaveChanges();
            }

            using (var client = new TestClientProvider(seedData).Client) {
                // When child is queried with asOf timestamp
                var responseAsOf = await client.GetGraphQLAsync(
                    $@"{{
                        child(id: ""{childId.Value}"", asOf: ""{asOf.Value}"") {{
                            firstName
                        }}
                    }}"
                );

                // Then the old version of the child  is returned
                responseAsOf.EnsureSuccessStatusCode();
                Child childAsOf = await responseAsOf.ParseGraphQLResponse<Child>();
                Assert.Equal(ChildHelper.FIRST_NAME, childAsOf.FirstName);

                // When child is queried
                var responseCurrent = await client.GetGraphQLAsync(
                    $@"{{
                        child(id: ""{childId.Value}"") {{
                            firstName
                        }}
                    }}"
                );

                // Then the current version of the child is returned
                responseCurrent.EnsureSuccessStatusCode();
                Child childCurrent = await responseCurrent.ParseGraphQLResponse<Child>();
                Assert.Equal(updatedName, childCurrent.FirstName);
            }
        }

        [Fact]
        public async Task Get_Child_By_Id_As_Of_With_Family()
        {
            // Given
            Guid? childId = null;
            int? familyId = null;
            DateTime? asOf = null;
            int caseNumber = 111111;
            void seedData(HedwigContext context) {
                var family = FamilyHelper.CreateFamily(context);
                familyId = family.Id;
                var child = ChildHelper.CreateChild(context, familyIdOverride: familyId.Value);
                childId = child.Id;
                asOf = Utilities.GetAsOfWithSleep();

                family.CaseNumber = caseNumber;
                context.SaveChanges();
            }

            using (var client = new TestClientProvider(seedData).Client) {
                // When child is queried with asOf timestamp
                var responseAsOf = await client.GetGraphQLAsync(
                    $@"{{
                        child(asOf: ""{asOf.Value}"", id: ""{childId}"") {{
                            family {{
                                id,
                                caseNumber
                            }}
                        }}
                    }}"
                );

                // Then then old version of the child is returned
                responseAsOf.EnsureSuccessStatusCode();
                Child childAsOf = await responseAsOf.ParseGraphQLResponse<Child>();
                Assert.Equal(familyId, childAsOf.Family.Id);
                Assert.False(childAsOf.Family.CaseNumber.HasValue);

                // When child is queried
                var responseCurrent = await client.GetGraphQLAsync(
                    $@"{{
                        child(id: ""{childId.Value}"") {{
                            family {{
                                id,
                                caseNumber
                            }}
                        }}
                    }}"
                );

                // Then the current version of the child is returned
                responseCurrent.EnsureSuccessStatusCode();
                Child childCurrent = await responseCurrent.ParseGraphQLResponse<Child>();
                Assert.Equal(familyId, childCurrent.Family.Id);
                Assert.Equal(caseNumber, childCurrent.Family.CaseNumber);
            }
        }

        [Fact]
        public async Task Get_Child_By_Id_As_Of_With_Family_And_Determinations()
        {
            // Given
            Guid? childId = null;
            int? familyId = null;
            int? determinationId = null;
            DateTime? asOf = null;
            void seedData(HedwigContext context) {
                var family = FamilyHelper.CreateFamily(context);
                familyId = family.Id;
                var child = ChildHelper.CreateChild(context, familyIdOverride: familyId.Value);
                childId = child.Id;
                asOf = Utilities.GetAsOfWithSleep();

                var determination = FamilyDeterminationHelper.CreateDeterminationWithFamilyId(context, familyId.Value);
                determinationId = determination.Id;
                family.Determinations = new FamilyDetermination[] { determination };
                context.SaveChanges();
            }

            using (var client = new TestClientProvider(seedData).Client) {
                // When child is queried with asOf timestamp
                var responseAsOf = await client.GetGraphQLAsync(
                    $@"{{
                        child(asOf: ""{asOf.Value}"", id: ""{childId}"") {{
                            family {{
                                id,
                                determinations {{
                                    id
                                }}
                            }}
                        }}
                    }}"
                );

                // Then then old version of the child 
                responseAsOf.EnsureSuccessStatusCode();
                Child childAsOf = await responseAsOf.ParseGraphQLResponse<Child>();
                Assert.Equal(familyId, childAsOf.Family.Id);
                Assert.Empty(childAsOf.Family.Determinations);

                // When child is queried
                var responseCurrent = await client.GetGraphQLAsync(
                    $@"{{
                        child(id: ""{childId.Value}"") {{
                            family {{
                                id,
                                determinations {{
                                    id
                                }}
                            }}
                        }}
                    }}"
                );

                // Then the current version of the child is returned
                responseCurrent.EnsureSuccessStatusCode();
                Child childCurrent = await responseCurrent.ParseGraphQLResponse<Child>();
                Assert.Equal(familyId, childCurrent.Family.Id);
                Assert.Single(childCurrent.Family.Determinations);
            }
        }
    }
}