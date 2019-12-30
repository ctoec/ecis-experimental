import React, { ReactElement, useContext } from 'react';
import AlertContext from '../contexts/Alert/AlertContext';
import Alert from '../components/Alert/Alert';
import DirectionalLink from '../components/DirectionalLink/DirectionalLink';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

type CommonContainerPropsType = {
	children: ReactElement<any> | null;
	// TODO: IMPORT THE ACTUAL TYPE
	directionalLinkProps?: any;
};

export default function CommonContainer({
	children,
	directionalLinkProps = { direction: 'left', to: '/roster', text: 'Back to roster' },
}: CommonContainerPropsType) {
	const { getAlerts } = useContext(AlertContext);
	const alerts = getAlerts();

	return (
		<ErrorBoundary>
			<div className="grid-container">
				<DirectionalLink {...directionalLinkProps} />
				{alerts && alerts.map((alert, index) => <Alert key={index} {...alert}></Alert>)}
			</div>
			<ErrorBoundary>{children}</ErrorBoundary>
		</ErrorBoundary>
	);
}
