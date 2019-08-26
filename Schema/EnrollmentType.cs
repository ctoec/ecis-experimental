using System;
using ecis2.Models;
using ecis2.Repositories;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace ecis2.Schema
{
	public class EnrollmentType : ObjectGraphType<Enrollment>
	{
		public EnrollmentType(IDataLoaderContextAccessor dataLoader, IChildRepository children, IFundingRepository fundings)
		{
			Field(e => e.Id);
			Field(e => e.Entry);
			Field(e => e.Exit, nullable: true);
			Field<ChildType>(
				"child",
				resolve: context =>
				{
					var loader = dataLoader.Context.GetOrAddBatchLoader<Guid, Child>(
						"GetChildrenByIdsAsync",
						children.GetChildrenByIdsAsync);

					return loader.LoadAsync(context.Source.ChildId);
				}
			);
			Field<ListGraphType<FundingType>>(
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
