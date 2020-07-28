import React from 'react';

type RowProps<T> = {
	row: T;
	cells: React.FC<{ row: T }>[];
	onClick?: (row: T) => () => any;
};

export default function Row<T>({ row, cells }: RowProps<T>) {
	return (
		<tr>
			{cells.map((Cell, index) => (
				<Cell row={row} key={index} />
			))}
		</tr>
	);
}
