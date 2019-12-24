import { createContext, useState, Dispatch, SetStateAction } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AlertProps } from '../../components/Alert/Alert';

export type AlertContextType = {
	getAlerts: () => AlertProps[],
	// setAlerts: Dispatch<SetStateAction<AlertProps[]>>,
	setAlerts: (newAlerts: AlertProps[]) => void,
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
	const [alertsDisplayedAtPath, setalertsDisplayedAtPath] = useState();

	const location = useLocation();

	const setAlerts = (newAlerts: AlertProps[]) => {
		if (newAlerts.length === 0) {
			setalertsDisplayedAtPath(undefined);
		}
		setalertsSetAtPath(location.pathname);
		internalSetAlerts(newAlerts);
	}

	const getAlerts = (): AlertProps[] => {
		// TODO: right now the alerts stick around on that same page if you navigate back to it-- do we want that behavior or should we do a history listen to get rid of it?
		// Also-- will this work better at a lower scope now? Or do we prefer shared alert context?
		if (alerts.length && (location.pathname !== alertsSetAtPath)) {
			// If there are alerts and we are at a different path than where we set the alerts
			if (!alertsDisplayedAtPath) {
				// If there is not already a displayed at path set one
				setalertsDisplayedAtPath(location.pathname);
				return alerts;
			}
			if (alertsDisplayedAtPath !== location.pathname) {
				// If we are no longer where the alerts were set or displayed, clear the alerts
				setAlerts([]);
				return [];
			}
		}
		return alerts;
	}

	return {
		getAlerts,
		setAlerts,
	};
};
