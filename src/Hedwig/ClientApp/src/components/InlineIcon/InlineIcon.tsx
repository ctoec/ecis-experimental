import React from 'react';

type Icon = 'attentionNeeded' | 'complete' | 'incomplete';

export type InlineIconProps = {
	icon: Icon;
	provideScreenReaderFallback?: boolean;
};

export default function InlineIcon({ icon, provideScreenReaderFallback = true }: InlineIconProps) {
	let text: string;

	switch (icon) {
		case 'attentionNeeded':
			text = 'attention needed';
			break;
		case 'complete':
			text = 'complete';
			break;
		case 'incomplete':
			text = 'incomplete';
			break;
		default:
			text = '';
	}

	return (
		<span className={`oec-inline-icon oec-inline-icon--${icon}`}>
			{provideScreenReaderFallback && <span className="usa-sr-only">({text})</span>}
		</span>
	);
}
