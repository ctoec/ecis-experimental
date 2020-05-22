import { ApiError } from './useApi';
import { useState, useEffect, useContext } from 'react';
import { isBlockingValidationError } from '../utils/validations';
import AlertContext from '../contexts/Alert/AlertContext';
import { validationErrorAlert } from '../utils/stringFormatters/alertTextMakers';

const useCatchallErrorAlert = (error: ApiError | null) => {
	const { setAlerts } = useContext(AlertContext);
	const [hasAlertedOnError, setHasAlertedOnError] = useState(false);

	useEffect(() => {
		if (!error) return;

		if (!hasAlertedOnError) {
			if (!isBlockingValidationError(error)) {
				throw new Error(error.title || 'Unknown API error');
			}
			setAlerts([validationErrorAlert]);
		} else {
			setAlerts([]);
		}
	}, [error, hasAlertedOnError]);

	const alert = () => setHasAlertedOnError(true);
	return {
		hasAlerted: hasAlertedOnError,
		alert,
	};
};

export default useCatchallErrorAlert;
