import React, { ReactElement, useContext } from 'react';
import cx from 'classnames';
import AlertContext from '../contexts/Alert/AlertContext';
import {
	Alert,
	AlertProps,
	TextWithIcon,
	TextWithIconProps,
	ErrorBoundary,
	Button,
} from '../components';

type CommonContainerPropsType = {
	children: ReactElement<any> | null;
	backHref?: string;
	additionalAlerts?: AlertProps[];
};

export default function CommonContainer({
	children,
	backHref,
	additionalAlerts = [] as AlertProps[],
}: CommonContainerPropsType) {
	const { getAlerts } = useContext(AlertContext);
	const alerts = [...additionalAlerts, ...getAlerts()];

	return (
		<ErrorBoundary>
			<div className={cx({ 'grid-container': backHref || alerts.length })}>
				{backHref && (
					<Button
						text={
							<TextWithIcon text="Back to roster" imageFileName="arrowRight" direction="left" />
						}
						appearance="unstyled"
						href={backHref}
					/>
				)}
				{alerts && alerts.map((alert, index) => <Alert key={index} {...alert}></Alert>)}
			</div>
			<ErrorBoundary>{children}</ErrorBoundary>
		</ErrorBoundary>
	);
}
