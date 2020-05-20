import { ApiError } from "./useApi";
import { useState, useEffect, useContext } from "react";
import { isBlockingValidationError } from "../utils/validations";
import AlertContext from "../contexts/Alert/AlertContext";
import { validationErrorAlert } from "../utils/stringFormatters/alertTextMakers";

export default function useCatchallErrorAlert(error: ApiError | null) {
	const {setAlerts} = useContext(AlertContext);
	const [hasAlertedOnError, setHasAlertedOnError] = useState(false);

	useEffect(() => {
		if(error && !hasAlertedOnError) {
			if(!isBlockingValidationError(error)) {
				throw new Error(error.title || "Unknown API error");
			}
			setAlerts([validationErrorAlert]);
		}
	}, [error, hasAlertedOnError]);

	return setHasAlertedOnError;
}
