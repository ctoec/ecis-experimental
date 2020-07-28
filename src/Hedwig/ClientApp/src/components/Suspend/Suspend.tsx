import React from 'react';

type SuspendProps = {
	waitFor: boolean;
	fallback: React.ReactElement | null;
};

export const Suspend: React.FC<SuspendProps> = ({ waitFor, fallback, children }) => {
	if (!waitFor) {
		return fallback;
	}

	return <>{children}</>;
};
