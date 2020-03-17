import React from 'react';
import { Alert, AlertProps } from '..';

type ErrorBoundaryState = {
	hasError: boolean;
};

type ErrorBoundaryProps = {
	alertProps?: AlertProps;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
	// https://reactjs.org/docs/error-boundaries.html
	// Hooks don't handle componentDidCatch so this has to be a class for now
	// https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
	public readonly state: ErrorBoundaryState = {
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
		const alertProps = this.props.alertProps || {
			text: 'Something went wrong',
			type: 'error',
			heading: 'Error',
		};
		if (hasError) {
			// TODO: set alert context here instead? return nothing?
			return <Alert {...alertProps} />;
		}

		return this.props.children;
	}
}
