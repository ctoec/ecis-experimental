import React from 'react';
import { Alert, AlertProps } from '..';

type SupendBoundaryState = {
	hasError: boolean;
};

type SuspendBoundaryProps = {
	fallback: React.ReactNode;
};

export class SuspendBoundary extends React.Component<SuspendBoundaryProps> {
	// https://reactjs.org/docs/error-boundaries.html
	// Hooks don't handle componentDidCatch so this has to be a class for now
	// https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
	public readonly state: SupendBoundaryState = {
		hasError: false,
	};

	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: any, errorInfo: any) {
		console.error(error, errorInfo);
	}

	render() {
		const { hasError } = this.state;

		if (hasError) {
			return this.props.fallback;
		}

		return this.props.children;
	}
}
