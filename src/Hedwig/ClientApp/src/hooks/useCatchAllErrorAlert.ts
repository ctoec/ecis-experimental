import { ApiError } from './useApi';
import { useState, useEffect, useContext } from 'react';
import { isBlockingValidationError } from '../utils/validations';
import AlertContext from '../contexts/Alert/AlertContext';
import { validationErrorAlert } from '../utils/stringFormatters/alertTextMakers';

export type ErrorAlertState = {
	hasAlerted: boolean;
	alert: () => void;
};

const useCatchAllErrorAlert: (error: ApiError | null) => ErrorAlertState = (error) => {
	const { setAlerts } = useContext(AlertContext);
	const [hasAlertedOnError, setHasAlertedOnError] = useState(false);

	useEffect(() => {
		if (!error) {
			setAlerts([]);
			return;
		}

		if (!hasAlertedOnError) {
			if (!isBlockingValidationError(error)) {
				throw new Error(error.title || 'Unknown API error');
			}
			setAlerts([validationErrorAlert]);
		} else {
			setAlerts([]);
		}
	}, [error, hasAlertedOnError, setAlerts]);

	const alert = () => setHasAlertedOnError(true);
	return {
		hasAlerted: hasAlertedOnError,
		alert,
	};
};

export default useCatchAllErrorAlert;
