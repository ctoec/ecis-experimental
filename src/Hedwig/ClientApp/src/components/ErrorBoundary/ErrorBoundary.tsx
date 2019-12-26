import React from 'react';
import Alert from '../Alert/Alert';

type ErrorBoundaryState = {
	hasError: boolean;
};

class ErrorBoundary extends React.Component {
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
		console.log(error, errorInfo);
	}

	render() {
		const { hasError } = this.state;
		if (hasError) {
			// You can render any custom fallback UI
			// TODO: set alert context here instead? return nothing?
			return <Alert text="Something went wrong" type="error" heading="Error" />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
