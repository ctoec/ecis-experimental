import React from 'react';

export type TagProps = {
	text: String;
	color?: string;
	className?: string;
};

export default function Tag({ text, color, className: addClassName }: TagProps) {
	var className = `usa-tag ${addClassName}`;
	if (color) className += ` bg-${color}`;
	return <span className={className}>{text}</span>;
}
