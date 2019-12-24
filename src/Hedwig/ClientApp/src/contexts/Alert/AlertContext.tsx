import { createContext, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AlertProps } from '../../components/Alert/Alert';

export type AlertContextType = {
	getAlerts: () => AlertProps[];
	setAlerts: (newAlerts: AlertProps[]) => void;
};

const AlertContext = createContext<AlertContextType>({
	getAlerts: () => [],
	setAlerts: _ => {},
});

const { Provider, Consumer } = AlertContext;

export { Provider as AlertProvider };
export { Consumer as AlertConsumer };
export default AlertContext;

export const useAlertContext = (initial?: AlertProps[]): AlertContextType => {
	const [alerts, internalSetAlerts] = useState<AlertProps[]>(initial ? initial : []);
	const [alertsSetAtPath, setalertsSetAtPath] = useState();
	const [alertsDisplayAtPath, setalertsDisplayAtPath] = useState();

	const location = useLocation();

	const setAlerts = (newAlerts: AlertProps[]) => {
		if (newAlerts.length === 0) {
			setalertsDisplayAtPath(null);
		}
		setalertsSetAtPath(location.pathname);
		internalSetAlerts(newAlerts);
	};

	const history = useHistory();
	history.listen(() => {
		// Clear alerts when we navigate away from where they were set or displayed
		if (
			alerts.length &&
			location.pathname !== alertsSetAtPath &&
			location.pathname !== alertsDisplayAtPath
		) {
			setAlerts([]);
		}
	});

	const getAlerts = (): AlertProps[] => {
		if (alerts.length && location.pathname !== alertsSetAtPath && !alertsDisplayAtPath) {
			// If there are alerts, we are at a different path than where we set the alerts, and there is not already a displayed at path
			setalertsDisplayAtPath(location.pathname);
		}
		return alerts;
	};

	return {
		getAlerts,
		setAlerts,
	};
};
