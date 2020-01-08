import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const AlertProvider: React.FC = ({ children }) => {
	const location = useLocation();

	const [alerts, internalSetAlerts] = useState<AlertProps[]>([]);
	const [alertsSetAtPath, setAlertsSetAtPath] = useState();
	const [alertsDisplayAtPath, setAlertsDisplayAtPath] = useState();

	const setAlerts = (newAlerts: AlertProps[]) => {
		if (newAlerts.length > 0) {
			setAlertsSetAtPath(location.pathname);
		} else {
			setAlertsSetAtPath(null);
		}
		setAlertsDisplayAtPath(null); // Should always be reset when new alerts?
		internalSetAlerts(newAlerts);
	};

	useEffect(() => {
		if (
			alerts.length > 0 &&
			alertsDisplayAtPath &&
			location.pathname !== alertsDisplayAtPath
		) {
			setAlerts([]);
		}
	}, [location.pathname])

	const getAlerts = (): AlertProps[] => {
		if (alerts.length > 0 && location.pathname !== alertsSetAtPath && !alertsDisplayAtPath) {
			// If there are alerts, we are at a different path than where we set the alerts, and there is not already a displayed at path
			setAlertsDisplayAtPath(location.pathname);
		}
		return alerts;
	};

	return (
		<Provider
			value={{
				getAlerts,
				setAlerts,
			}}
		>
			{children}
		</Provider>
	);
};

export { Consumer as AlertConsumer };
export default AlertContext;
export { AlertProvider };
