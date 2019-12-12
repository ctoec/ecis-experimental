import React from 'react';
import pluralize from 'pluralize';
import { Table, TableProps } from '../../components/Table/Table';
import { Enrollment, FundingSpace } from '../../generated';

type AgeGroupSectionProps = {
	ageGroupTitle: string;
	tableProps: TableProps<Enrollment>;
	fundingCapacities: { [key: string]: FundingSpace[] };
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
			<ul>
				{Object.keys(fundingCapacities).map(capacityTime => (
					<li>{`${tableProps.data.length}/${
						fundingCapacities[capacityTime][0].capacity
					} ${capacityTime.toLowerCase()} time ${ageGroupTitle.toLowerCase()} spaces filled`}</li>
				))}
			</ul>
			<Table {...tableProps} fullWidth />
		</>
	);
}
