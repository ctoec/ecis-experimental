import React from 'react';
import { ReactComponent as Error } from '../../../node_modules/uswds/dist/img/alerts/error.svg';
import { ReactComponent as Info } from '../../../node_modules/uswds/dist/img/alerts/info.svg';
import { ReactComponent as Success } from '../../../node_modules/uswds/dist/img/alerts/success.svg';
import { ReactComponent as AngleArrowDown } from '../../assets/images/angleArrowDown.svg';
import { ReactComponent as ArrowDown } from '../../../node_modules/uswds/dist/img/arrow-down.svg';
import cx from 'classnames';

export type Icon = 'attentionNeeded' | 'complete' | 'incomplete' | 'arrowDown' | 'angleArrowDown';

export type InlineIconProps = {
	icon: Icon;
	provideScreenReaderFallback?: boolean;
	className?: string;
	svgProps?: React.SVGProps<SVGSVGElement>;
};

export function InlineIcon({
	icon,
	provideScreenReaderFallback = true,
	className,
	svgProps,
}: InlineIconProps) {
	let text: string;
	let iconComponent;

	switch (icon) {
		case 'attentionNeeded':
			text = 'attention needed';
			iconComponent = <Error {...svgProps} />;
			break;
		case 'complete':
			text = 'complete';
			iconComponent = <Success {...svgProps} />;
			break;
		case 'incomplete':
			text = 'incomplete';
			iconComponent = <Error {...svgProps} />;
			break;
		case 'arrowDown':
			text = 'select dropdown';
			iconComponent = <ArrowDown {...svgProps} />;
			break;
		case 'angleArrowDown':
			text = 'select dropdown';
			iconComponent = <AngleArrowDown {...svgProps} />;
			break;
		default:
			text = '';
			iconComponent = <Info />;
	}

	return (
		<span className={cx(className, 'oec-inline-icon', `oec-inline-icon--${icon}`)}>
			{iconComponent}
			{provideScreenReaderFallback && <span className={cx('usa-sr-only')}>({text})</span>}
		</span>
	);
}
