using System;
using Hedwig.Models;
using Hedwig.Repositories;
using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Types;

namespace Hedwig.Schema.Types
{
	public class CdcReportType : ObjectGraphType<CdcReport>
	{
		public CdcReportType(IDataLoaderContextAccessor dataLoader, IOrganizationRepository organizations)
		{
			Field(r => r.Id);
			Field(r => r.Type, type: typeof(NonNullGraphType<FundingSourceEnumType>));
			Field(r => r.ReportingPeriod.Period);
			Field(r => r.ReportingPeriod.PeriodStart);
			Field(r => r.ReportingPeriod.PeriodEnd);
			Field(r => r.ReportingPeriod.DueAt);
			Field(r => r.SubmittedAt, nullable: true);
			Field<NonNullGraphType<OrganizationType>>(
				"organization",
				resolve: context =>
				{
					var loader = dataLoader.Context.GetOrAddBatchLoader<int, Organization>(
						"GetOrganizationsByIdsAsync",
						(ids) => organizations.GetOrganizationsByIdsAsync(ids));

					return loader.LoadAsync(context.Source.OrganizationId);
				}
			);
		}
	}
}
