import React from 'react';
import { SuspendBoundary } from './SuspendBoundary';

type SuspendProps = {
	waitFor: boolean;
	fallback: React.ReactElement | null;
};

export const Suspend: React.FC<SuspendProps> = ({ waitFor, fallback, children }) => {
	if (React.isValidElement(children)) {
		const props = children.props;
		console.log(props);
	}
	if (!waitFor) {
		return fallback;
	}

	return <>{children}</>;
};
