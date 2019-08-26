import React from 'react';
import ColumnHeader from './ColumnHeader';
import Row from './Row';

type Column<T> = {
	name: string;
	cell: React.FC<{ row: T }>;
	sort?: (row: T) => number | string;
};

export type SortOrder = 'asc' | 'desc';

export type TableProps<T> = {
	id: string;
	data: T[];
	rowKey: (row: T) => number | string;
	columns: Column<T>[];
	defaultSortColumn?: number;
	defaultSortOrder?: SortOrder;
	onRowClick?: (row: T) => () => any;
	fullWidth?: boolean;
};

export type TableSort = {
	sortColumn?: number;
	sortOrder?: SortOrder;
};

export class Table<T> extends React.Component<TableProps<T>, TableSort> {
	constructor(props: TableProps<T>) {
		super(props);

		const { defaultSortColumn, defaultSortOrder } = props;
		this.state = { sortColumn: defaultSortColumn, sortOrder: defaultSortOrder };
	}

	setTableSort = (sort: TableSort) => {
		this.setState(sort);
	};

	render() {
		const { id, data, rowKey, columns, onRowClick, fullWidth } = this.props;
		const { sortColumn, sortOrder } = this.state;

		const cells = columns.map(column => column.cell);

		let sortedData = data;

		if (typeof sortColumn !== 'undefined' && sortOrder) {
			const sortBy = columns[sortColumn].sort;

			if (sortBy) {
				sortedData = data.sort((a, b) => {
					const aBy = sortBy(a);
					const bBy = sortBy(b);

					// prettier-ignore
					if (aBy === bBy) {
						return 0;
					} else if ((aBy < bBy) === (sortOrder === 'asc')) {
						return -1;
					} else {
						return 1;
					}
				});
			}
		}

		return (
			<table id={id} className={`oec-table ${fullWidth && 'oec-table--full-width'}`}>
				<thead>
					<tr>
						{columns.map((column, index) => (
							<ColumnHeader
								tableId={id}
								name={column.name}
								sortable={!!column.sort}
								sorted={sortColumn === index}
								sortOrder={sortOrder}
								index={index}
								key={index}
								setTableSort={this.setTableSort}
							/>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedData.map((row, index) => (
						<Row row={row} cells={cells} onClick={onRowClick} key={rowKey(row)} />
					))}
				</tbody>
			</table>
		);
	}
}

export default Table;
