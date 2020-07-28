import React from 'react';
import cx from 'classnames';
import { SortOrder, TableSort } from './Table';
import { ReactComponent as DownArrowCircle } from '../../assets/images/downArrowCircle.svg';

type ColumnHeaderProps = {
	name: string | JSX.Element;
	sortable: boolean;
	sorted: boolean;
	sortOrder?: SortOrder;
	index: number;
	setTableSort: (sort: TableSort) => any;
	width?: string;
	className?: string;
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
		const { name, sortable, sorted, sortOrder, width, className } = this.props;
		return (
			<th
				scope="col"
				className={cx(
					'oec-table__column-header',
					{ 'oec-sortable': sortable },
					{ 'oec-sorted': sorted },
					{ 'oec-unsorted': !sorted },
					className
				)}
				role="columnheader"
				aria-sort={sortOrder || 'none'}
				style={{ width: width }}
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
						<div
							className={cx(
								'oec-table__sort-controls',
								{ 'oec-table__sort-controls--ascending': sorted && sortOrder === 'ascending' },
								{ 'oec-table__sort-controls--descending': sorted && sortOrder === 'descending' }
							)}
						>
							<DownArrowCircle title="Sort" />
						</div>
					</button>
				)}
			</th>
		);
	}
}

export default ColumnHeader;
