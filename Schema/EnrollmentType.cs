using System;
using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema
{
	public class EnrollmentType : ObjectGraphType<Enrollment>
	{
		public EnrollmentType(IDataLoaderContextAccessor dataLoader, IChildRepository children, IFundingRepository fundings)
		{
			Field(e => e.Id);
			Field(e => e.Entry);
			Field(e => e.Exit, nullable: true);
			Field<NonNullGraphType<ChildType>>(
				"child",
				resolve: context =>
				{
					var loader = dataLoader.Context.GetOrAddBatchLoader<Guid, Child>(
						"GetChildrenByIdsAsync",
						children.GetChildrenByIdsAsync);

					return loader.LoadAsync(context.Source.ChildId);
				}
			);
			Field<NonNullGraphType<ListGraphType<NonNullGraphType<FundingType>>>>(
				"fundings",
				resolve: context =>
				{
					var loader = dataLoader.Context.GetOrAddCollectionBatchLoader<int, Funding>(
						"GetFundingsByEnrollmentIdsAsync",
						fundings.GetFundingsByEnrollmentIdsAsync);

					return loader.LoadAsync(context.Source.Id);
				}
			);
		}
	}
}
