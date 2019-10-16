import React from 'react';

type Icon = 'attentionNeeded';

export type InlineIconProps = {
	icon: Icon;
};

export default function InlineIcon({ icon }: InlineIconProps) {
	let text: string;

	switch (icon) {
		case 'attentionNeeded':
			text = 'attention needed';
			break;
		default:
			text = '';
	}

	return (
		<span className={`oec-inline-icon oec-inline-icon--${icon}`}>
			<span className="usa-sr-only">({text})</span>
		</span>
	);
}
