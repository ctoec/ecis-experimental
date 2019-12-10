import React from 'react';
import { ReactComponent as Error } from '../../../node_modules/uswds/dist/img/alerts/error.svg';
import { ReactComponent as Info } from '../../../node_modules/uswds/dist/img/alerts/info.svg';
import { ReactComponent as Success } from '../../../node_modules/uswds/dist/img/alerts/success.svg';
import { ReactComponent as Warning } from '../../../node_modules/uswds/dist/img/alerts/warning.svg';


type Icon = 'attentionNeeded' | 'complete' | 'incomplete';

export type InlineIconProps = {
	icon: Icon;
	provideScreenReaderFallback?: boolean;
};

export default function InlineIcon({ icon, provideScreenReaderFallback = true }: InlineIconProps) {
	let text: string;
	let iconComponent;

	switch (icon) {
		case 'attentionNeeded':
			text = 'attention needed';
			iconComponent = <Error />;
			break;
		case 'complete':
			text = 'complete';
			iconComponent = <Success />;
			break;
		case 'incomplete':
			text = 'incomplete';
			iconComponent = <Error />;
			break;
		default:
			text = '';
			iconComponent = <Info />;
	}

	return (
		<span className={`oec-inline-icon oec-inline-icon--${icon}`}>
			{iconComponent}
			{provideScreenReaderFallback && <span className="usa-sr-only">({text})</span>}
		</span>
	);
}
