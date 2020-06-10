import React, { ReactElement, useContext } from 'react';
import cx from 'classnames';
import AlertContext from '../contexts/Alert/AlertContext';
import { Alert, AlertProps, TextWithIcon, ErrorBoundary, Button } from '../components';
import { ReactComponent as ArrowRight } from '../assets/images/arrowRight.svg';

export type CommonContainerPropsType = {
	children: ReactElement<any> | null;
	backHref?: string;
	backText?: string;
	additionalAlerts?: AlertProps[];
};

export default function CommonContainer({
	children,
	backHref,
	backText,
	additionalAlerts = [] as AlertProps[],
}: CommonContainerPropsType) {
	const { getAlerts } = useContext(AlertContext);
	const alerts = [...additionalAlerts, ...getAlerts()];

	return (
		<ErrorBoundary>
			<div className={cx({ 'grid-container': backHref || alerts.length })}>
				{backHref && backText && (
					<Button
						appearance="unstyled"
						href={backHref}
						className="text-bold text-underline"
						text={<TextWithIcon text={backText} Icon={ArrowRight} direction="left" />}
					/>
				)}
				{alerts && alerts.map((alert, index) => <Alert key={index} {...alert}></Alert>)}
			</div>
			<ErrorBoundary>{children}</ErrorBoundary>
		</ErrorBoundary>
	);
}
