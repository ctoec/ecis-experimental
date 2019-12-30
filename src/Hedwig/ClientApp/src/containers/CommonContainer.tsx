import React, { ReactElement, useContext } from 'react';
import AlertContext from '../contexts/Alert/AlertContext';
import Alert, { AlertProps } from '../components/Alert/Alert';
import DirectionalLink, { DirectionalLinkProps } from '../components/DirectionalLink/DirectionalLink';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

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
	const alerts = additionalAlerts.concat(getAlerts());

	return (
		<ErrorBoundary>
			<div className="grid-container">
				{directionalLinkProps && <DirectionalLink {...directionalLinkProps} />}
				{alerts && alerts.map((alert, index) => <Alert key={index} {...alert}></Alert>)}
			</div>
			<ErrorBoundary>{children}</ErrorBoundary>
		</ErrorBoundary>
	);
}
