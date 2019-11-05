using GraphQL.Types;
using GraphQL;
using Hedwig.Repositories;
using Hedwig.Schema.Types;
using Hedwig.Models;
using System;

namespace Hedwig.Schema.Mutations
{
    public class FamilyDeterminationMutation : ObjectGraphType<FamilyDetermination>, IAppSubMutation
    {
        public FamilyDeterminationMutation(IFamilyDeterminationRepository familyDeterminations, IFamilyRepository families)
        {
            FieldAsync<FamilyDeterminationType>(
                "createFamilyDetermination",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "familyId" },
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "numberOfPeople" },
                    new QueryArgument<NonNullGraphType<DecimalGraphType>> { Name = "income" },
                    new QueryArgument<NonNullGraphType<DateGraphType>> { Name = "determined" }
                ),
                resolve: async context => 
                {
                    var familyId = context.GetArgument<int>("familyId");
                    var family = await families.GetFamilyByIdAsync(familyId);
                    if ( family == null) {
                        throw new ExecutionError(
                            AppErrorMessages.NOT_FOUND("Family", familyId)
                        );
                    }

                    var numberOfPeople = context.GetArgument<int>("numberOfPeople");
                    var income = context.GetArgument<decimal>("income");
                    var determined = context.GetArgument<DateTime>("determined");

                    var determination = familyDeterminations.CreateFamilyDetermination(
                        numberOfPeople: numberOfPeople,
                        income: income,
                        determined: determined,
                        familyId: family.Id
                    );
                    return determination;
                }
            );
            FieldAsync<FamilyDeterminationType>(
                "updateFamilyDetermination",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                    new QueryArgument<IntGraphType> { Name = "numberOfPeople" },
                    new QueryArgument<DecimalGraphType> { Name = "income" },
                    new QueryArgument<DateGraphType> { Name = "determined" }
                ),
                resolve: async context => 
                {
                    var id = context.GetArgument<int>("id");
                    var determination = await familyDeterminations.GetDeterminationByIdAsync(id);
                    if (determination == null) {
                        throw new ExecutionError(
                            AppErrorMessages.NOT_FOUND("FamilyDetermination", id)
                        );
                    }

                    var numberOfPeople = context.GetArgument<int?>("numberOfPeople");
                    var income = context.GetArgument<decimal?>("income");
                    var determined = context.GetArgument<DateTime?>("determined");

                    return familyDeterminations.UpdateFamilyDetermination(
                        determination,
                        numberOfPeople: numberOfPeople,
                        income: income,
                        determined: determined
                    );
                }
            );
        }
    }
}
