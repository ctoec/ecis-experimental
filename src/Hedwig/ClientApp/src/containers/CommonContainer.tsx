import React, { ReactElement, useContext } from 'react';
import cx from 'classnames';
import AlertContext from '../contexts/Alert/AlertContext';
import { Alert, AlertProps, TextWithIcon, ErrorBoundary, Button } from '../components';
import { ReactComponent as ArrowRight } from '../assets/images/arrowRight.svg';
import HistoryContext from '../contexts/History/HistoryContext';
import { createPath } from 'history';

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

	const { previousLocation } = useContext(HistoryContext);

	return (
		<ErrorBoundary>
			<div className={cx({ 'grid-container': backText || alerts.length })}>
				{backText && (
					<Button
						appearance="unstyled"
						href={backHref || createPath(previousLocation)}
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
