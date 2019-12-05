import React from 'react';

export type TagProps = {
	text: String;
	color?: string;
	addClass?: string;
};

export default function Tag({ text, color, addClass }: TagProps) {
	var className = `usa-tag ${addClass}`;
	if (color) className += ` bg-${color}`;
	return <span className={className}>{text}</span>;
}
