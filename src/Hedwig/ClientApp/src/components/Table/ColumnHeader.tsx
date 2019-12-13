import React from 'react';
import { SortOrder, TableSort } from './Table';

type ColumnHeaderProps = {
	name: string;
	sortable: boolean;
	sorted: boolean;
	sortOrder?: SortOrder;
	index: number;
	setTableSort: (sort: TableSort) => any;
};

export class ColumnHeader extends React.Component<ColumnHeaderProps> {
	toggleSort = () => {
		const { sortable, sorted, sortOrder, index, setTableSort } = this.props;
		const newOrder: SortOrder = sorted && sortOrder === 'ascending' ? 'descending' : 'ascending';

		if (!sortable) {
			return;
		}

		setTableSort({ sortColumn: index, sortOrder: newOrder });
	};

	handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { sorted, sortOrder, index, setTableSort } = this.props;
		const newOrder = event.target.value as SortOrder;

		if (sorted && newOrder === sortOrder) {
			this.toggleSort();
		} else {
			setTableSort({ sortColumn: index, sortOrder: newOrder });
		}
	};

	render() {
		const { name, sortable, sorted, sortOrder, index } = this.props;
		return (
			<th
				scope="col"
				className={'oec-table__column-header' + (sortable ? ' oec-sortable' : '')}
				role="columnheader"
				aria-sort={sortOrder || 'none'}
			>
				{!sortable && <span className="oec-table__column-title">{name}</span>}
				{sortable && (
					<button
						className="oec-table__column-title usa-button--unstyled width-full"
						onClick={this.toggleSort}
						aria-label={`Sort table by ${name} in ${
							sorted && sortOrder === 'ascending' ? 'descending' : 'ascending'
						} order`}
					>
						{name}
						<div className="oec-table__sort-controls">
							<span
								className={`oec-table__sort-controls__asc${
									sorted && sortOrder === 'ascending' ? ' active' : ''
								}`}
							></span>
							<span
								className={`oec-table__sort-controls__desc${
									sorted && sortOrder === 'descending' ? ' active' : ''
								}`}
							></span>
						</div>
					</button>
				)}
			</th>
		);
	}
}

export default ColumnHeader;
