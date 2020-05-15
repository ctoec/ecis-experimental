import React, { ReactElement, useContext } from 'react';
import cx from 'classnames';
import AlertContext from '../contexts/Alert/AlertContext';
import {
	Alert,
	AlertProps,
	DirectionalLink,
	DirectionalLinkProps,
	ErrorBoundary,
} from '../components';

type CommonContainerPropsType = {
	children: ReactElement<any> | null;
	directionalLinkProps?: DirectionalLinkProps;
	additionalAlerts?: AlertProps[];
};

export default function CommonContainer({
	children,
	directionalLinkProps,
	additionalAlerts = [] as AlertProps[],
}: CommonContainerPropsType) {
	const { getAlerts } = useContext(AlertContext);
	const alerts = [...additionalAlerts, ...getAlerts()];

	return (
		<ErrorBoundary>
			<div className={cx({ 'grid-container': directionalLinkProps || alerts.length })}>
				{directionalLinkProps && <DirectionalLink {...directionalLinkProps} />}
				{alerts && alerts.map((alert, index) => <Alert key={index} {...alert}></Alert>)}
			</div>
			<ErrorBoundary>{children}</ErrorBoundary>
		</ErrorBoundary>
	);
}
