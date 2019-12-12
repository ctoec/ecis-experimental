import React from 'react';
import pluralize from 'pluralize';
import { Table, TableProps } from '../../components/Table/Table';
import { Enrollment, FundingSpace } from '../../generated';

type AgeGroupSectionProps = {
	ageGroupTitle: string;
	tableProps: TableProps<Enrollment>;
	fundingCapacities?: { [key: string]: FundingSpace[] };
};

export default function AgeGroupSection({
	ageGroupTitle,
	tableProps,
	fundingCapacities,
}: AgeGroupSectionProps) {
	if (!tableProps.data.length) return <></>;
	return (
		<>
			<h2>{`${ageGroupTitle} (${pluralize('child', tableProps.data.length, true)})`}</h2>
			{fundingCapacities && (
				<ul>
					{Object.keys(fundingCapacities).map(capacityTime => (
						<li>
							<span className="text-bold">
								{`${tableProps.data.length}/${
									fundingCapacities[capacityTime][0].capacity
								} ${capacityTime.toLowerCase()} time`}
							</span>
							<span>{` ${ageGroupTitle.toLowerCase()} spaces filled`}</span>
						</li>
					))}
				</ul>
			)}
			<Table {...tableProps} fullWidth />
		</>
	);
}
