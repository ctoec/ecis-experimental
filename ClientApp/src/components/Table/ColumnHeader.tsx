import React from 'react';
import { SortOrder, TableSort } from './Table';

type ColumnHeaderProps = {
	tableId: string;
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
		const newOrder: SortOrder = sorted && sortOrder === 'asc' ? 'desc' : 'asc';

		if (!sortable) {
			return;
		}

		setTableSort({ sortColumn: index, sortOrder: newOrder });
	};

	handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { sorted, sortOrder, index, setTableSort } = this.props;
		const newOrder = event.target.value as SortOrder;

		if (sorted && newOrder === sortOrder) {
			return;
		} else {
			setTableSort({ sortColumn: index, sortOrder: newOrder });
		}
	};

	render() {
		const { tableId, name, sortable, sorted, sortOrder, index } = this.props;

		return (
			<th scope="col">
				<span onClick={this.toggleSort}>{name}</span>
				{sortable && (
					<div className="oec-table__sort-controls">
						<input
							id={`${tableId}-col${index}-asc`}
							name={`${tableId}-column-${index}-sort`}
							value={`asc`}
							type="checkbox"
							checked={sorted && sortOrder === 'asc'}
							onChange={this.handleSortChange}
						/>
						<label className="oec-table__sort-controls__asc" htmlFor={`${tableId}-col${index}-asc`}>
							<span>Sort ascending</span>
						</label>
						<input
							id={`${tableId}-col${index}-desc`}
							name={`${tableId}-column-${index}-sort`}
							value={`desc`}
							type="checkbox"
							checked={sorted && sortOrder === 'desc'}
							onChange={this.handleSortChange}
						/>
						<label
							className="oec-table__sort-controls__desc"
							htmlFor={`${tableId}-col${index}-desc`}
						>
							<span>Sort descending</span>
						</label>
					</div>
				)}
			</th>
		);
	}
}

export default ColumnHeader;
