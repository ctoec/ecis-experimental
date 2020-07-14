import React, { ReactElement, useContext } from 'react';
import cx from 'classnames';
import AlertContext from '../contexts/Alert/AlertContext';
import { Alert, AlertProps, TextWithIcon, ErrorBoundary, Button } from '@ctoec/component-library';
import { ReactComponent as ArrowRight } from '../assets/images/arrowRight.svg';
import HistoryContext from '../contexts/History/HistoryContext';
import { createPath } from 'history';

export type CommonContainerPropsType = {
	backHref?: string;
	backText?: string;
	additionalAlerts?: AlertProps[];
};

const CommonContainer: React.FC<CommonContainerPropsType> = ({
	backHref,
	backText,
	additionalAlerts = [] as AlertProps[],
	children,
}) => {
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
						className="text-bold"
						text={
							<TextWithIcon
								text={backText}
								Icon={ArrowRight}
								direction="left"
								className="text-underline"
							/>
						}
					/>
				)}
				{alerts && alerts.map((alert, index) => <Alert key={index} {...alert}></Alert>)}
			</div>
			<ErrorBoundary>{children}</ErrorBoundary>
		</ErrorBoundary>
	);
};

export default CommonContainer;
