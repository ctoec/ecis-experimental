using GraphQL.Types;
using GraphQL;
using Hedwig.Schema.Types;
using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Schema.Mutations
{
    public class FundingMutation : ObjectGraphType<Funding>, IAppSubMutation
    {
        public FundingMutation(IFundingRepository fundings, IEnrollmentRepository enrollments)
        {
            FieldAsync<FundingType>(
                "createFunding",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "enrollmentId" },
                    new QueryArgument<NonNullGraphType<FundingSourceEnumType>> { Name = "source" },
                    new QueryArgument<NonNullGraphType<FundingTimeEnumType>> { Name = "time" }
    
                ),
                resolve: async context => 
                {
                    var enrollmentId = context.GetArgument<int>("enrollmentId");
                    var enrollment = await enrollments.GetEnrollmentByIdAsync(enrollmentId);
                    if (enrollment == null) {
                        throw new ExecutionError(
                            AppErrorMessages.NOT_FOUND("Enrollment", enrollmentId)
                        );
                    }

                    var source = context.GetArgument<FundingSource>("source");
                    var time = context.GetArgument<FundingTime>("time");

                    return fundings.CreateFunding(
                        enrollmentId,
                        source,
                        time
                    );
                }
            );
            FieldAsync<FundingType>(
                "updateFunding",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "id" },
                    new QueryArgument<FundingSourceEnumType> { Name = "source" },
                    new QueryArgument<FundingTimeEnumType> { Name = "time" }
                ),
                resolve: async context =>
                {
                    var id = context.GetArgument<int>("id");
                    var funding = await fundings.GetFundingByIdAsync(id);
                    if (funding == null) {
                        throw new ExecutionError(
                            AppErrorMessages.NOT_FOUND("Funding", id)
                        );
                    }

                    var source = context.GetArgument<FundingSource?>("source");
                    var time = context.GetArgument<FundingTime?>("time");

                    return fundings.UpdateFunding(funding, source, time);
                }
            );
        }
    }
}