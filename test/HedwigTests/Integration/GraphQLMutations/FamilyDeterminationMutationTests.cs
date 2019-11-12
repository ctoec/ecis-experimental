using Xunit;
using Hedwig.Models;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Hedwig.Schema;
using System;
using System.Threading.Tasks;

namespace HedwigTests.Integration.GraphQLMutations
{
    public class FamilyDeterminationMutationTests
    {
        [Fact]
        public async Task Create_Family_Determination()
        {
            using (var api = new TestApiProvider()) {
                var numberOfPeople = 4;
                var income = 20000M;
                var determined = DateTime.Now.Date;
                var family = FamilyHelper.CreateFamily(api.Context);

                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        createFamilyDetermination(
                            familyId: {family.Id},
                            numberOfPeople: {numberOfPeople},
                            income: ""{income}"",
                            determined: ""{determined}""
                        ) {{
                            family {{ id }}
                            numberOfPeople
                            income
                            determined
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                FamilyDetermination determination = await response.GetObjectFromGraphQLResponse<FamilyDetermination>("createFamilyDetermination");
                Assert.Equal(family.Id, determination.Family.Id);
                Assert.Equal(numberOfPeople, determination.NumberOfPeople);
                Assert.Equal(income, determination.Income);
                Assert.Equal(determined, determination.Determined);
            }
        }

        [Fact]
        public async Task Create_Family_Determination_Family_Id_Not_Found()
        {
            using (var api = new TestApiProvider()) {
                var numberOfPeople = 4;
                var income = 20000M;
                var determined = DateTime.Now;
                var invalidId = 0;

                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        createFamilyDetermination(
                            familyId: {invalidId},
                            numberOfPeople: {numberOfPeople},
                            income: {income},
                            determined: ""{determined}""
                        ) {{
                            family {{ id }}
                            numberOfPeople
                            income
                            determined
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                var gqlResponse = await response.ParseGraphQLResponse();
                Assert.NotEmpty(gqlResponse.Errors);
                Assert.Equal(AppErrorMessages.NOT_FOUND("Family", invalidId), gqlResponse.Errors[0].Message);
            }
        }

        [Fact]
        public async Task Update_Family_Determination()
        {
            using (var api = new TestApiProvider()) {
                var determination = FamilyDeterminationHelper.CreateDetermination(api.Context);
                var numberOfPeople = 10;

                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        updateFamilyDetermination(
                            id: {determination.Id},
                            numberOfPeople: {numberOfPeople}
                        ) {{
                            numberOfPeople
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                FamilyDetermination updated = await response.GetObjectFromGraphQLResponse<FamilyDetermination>("updateFamilyDetermination");
                Assert.Equal(numberOfPeople, updated.NumberOfPeople);
            }
        }

        [Fact]
        public async Task Update_Family_Determination_Not_Found()
        {
            using (var api = new TestApiProvider()) {
                var invalidId = 0;
                var response = await api.Client.PostGraphQLAsync(
                    $@"mutation {{
                        updateFamilyDetermination(
                            id: {invalidId}
                        ) {{
                            id
                        }}
                    }}"
                );

                response.EnsureSuccessStatusCode();
                var gqlResponse = await response.ParseGraphQLResponse();
                Assert.NotEmpty(gqlResponse.Errors);
                Assert.Equal(AppErrorMessages.NOT_FOUND("FamilyDetermination", invalidId), gqlResponse.Errors[0].Message);
            }
        }
    }
}