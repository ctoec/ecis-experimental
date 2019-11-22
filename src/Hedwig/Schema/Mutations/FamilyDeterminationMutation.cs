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
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "determined" }
                ),
                resolve: async context =>
                {
                    var familyId = context.GetArgument<int>("familyId");
                    var family = await families.GetFamilyByIdAsync_OLD(familyId);
                    if ( family == null) {
                        throw new ExecutionError(
                            AppErrorMessages.NOT_FOUND("Family", familyId)
                        );
                    }

                    var numberOfPeople = context.GetArgument<int>("numberOfPeople");
                    var income = context.GetArgument<decimal>("income");
                    var determinedStr = context.GetArgument<DateTime>("determined");

										try {
											var determined = ValueConverter.ConvertTo<DateTime>(determinedStr);

	                    var determination = familyDeterminations.CreateFamilyDetermination(
	                        numberOfPeople: numberOfPeople,
	                        income: income,
	                        determined: determined,
	                        familyId: family.Id
	                    );
	                    return determination;
										}
										catch (FormatException)
										{
                      throw new ExecutionError(
                          AppErrorMessages.BAD_REQUEST("FamilyDetermination")
                      );
										}
                }
            );
            FieldAsync<FamilyDeterminationType>(
                "updateFamilyDetermination",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                    new QueryArgument<IntGraphType> { Name = "numberOfPeople" },
                    new QueryArgument<DecimalGraphType> { Name = "income" },
                    new QueryArgument<StringGraphType> { Name = "determined" }
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
                    var determinedStr = context.GetArgument<String>("determined");

										try {
											var determined = ValueConverter.ConvertTo<DateTime>(determinedStr);

	                    return familyDeterminations.UpdateFamilyDetermination(
	                        determination,
	                        numberOfPeople: numberOfPeople,
	                        income: income,
	                        determined: determined
	                    );
										}
										catch (FormatException)
										{
                      throw new ExecutionError(
                          AppErrorMessages.BAD_REQUEST("FamilyDetermination")
                      );
										}
                }
            );
        }
    }
}
