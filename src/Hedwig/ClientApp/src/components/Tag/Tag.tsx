import React from 'react';
import cx from 'classnames';

export type TagProps = {
	text: string;
	key?: string;
	color?: string;
	className?: string;
};

export function Tag({ key, text, color, className }: TagProps) {
	const colorClass = color ? `bg-${color}` : undefined;
	return (
		<span key={key} className={cx('usa-tag', 'usa-tag--no-transform', className, colorClass)}>
			{text}
		</span>
	);
}
