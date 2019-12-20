import React, { ReactElement, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AlertContext from '../contexts/Alert/AlertContext';
import Alert from '../components/Alert/Alert';
import DirectionalLink from '../components/DirectionalLink/DirectionalLink';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

type ContainerContainerPropsType = {
	children: ReactElement<any> | null;
	directionalLinkProps?: any;
};

export default function ContainerContainer({
	children,
	directionalLinkProps = { direction: 'left', to: '/roster', text: 'Back to roster' },
}: ContainerContainerPropsType) {
	const { alerts } = useContext(AlertContext);

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
