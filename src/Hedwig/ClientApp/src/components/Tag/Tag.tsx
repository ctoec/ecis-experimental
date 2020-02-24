import React from 'react';

export type TagProps = {
	text: string;
	key?: string;
	color?: string;
	className?: string;
};

export function Tag({ key, text, color, className: addClassName }: TagProps) {
	var className = `usa-tag ${addClassName}`;
	if (color) className += ` bg-${color}`;
	return (
		<span key={key} className={className}>
			{text}
		</span>
	);
}
