import React, { ReactElement } from 'react';
import { useParams, useLocation } from 'react-router';
import { useAlertContext, AlertProvider } from '../contexts/Alert/AlertContext';
import Alert, { AlertProps } from '../components/Alert/Alert';
import DirectionalLink from '../components/DirectionalLink/DirectionalLink';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

type ContainerContainerPropsType = {
	children: ReactElement<any> | null;
	directionalLinkProps?: any;
};

export default function ContainerContainer({
	children,
	// TODO: SET TYPE, DEFAULT TO NONE
	directionalLinkProps = { direction: 'left', to: '/roster', text: 'Back to roster' },
}: ContainerContainerPropsType) {
	const { state } = useLocation<AlertProps[]>();
	const alertContext = useAlertContext(state);
	const { alerts } = alertContext;
	// TODO: Should error boundary push an error into alerts?
	console.log(alerts)

	// TODO: CAN THIS NOT DISPLAY ALERTS?

	return (
		<ErrorBoundary>
			<AlertProvider value={alertContext}>
				<div className="grid-container">
					<DirectionalLink {...directionalLinkProps} />
					{alerts.map((alert, index) => (
						<Alert key={index} {...alert}></Alert>
					))}
				</div>
				<ErrorBoundary>{children}</ErrorBoundary>
			</AlertProvider>
		</ErrorBoundary>
	);
}
