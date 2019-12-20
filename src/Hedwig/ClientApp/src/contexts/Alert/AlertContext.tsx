import { createContext, useState, Dispatch, SetStateAction } from 'react';
import { Switch, useLocation, useHistory } from 'react-router-dom';
import { AlertProps } from '../../components/Alert/Alert';

export type AlertContextType = {
	alerts: AlertProps[];
	// setAlerts: Dispatch<SetStateAction<AlertProps[]>>,
	setAlerts: (alerts: AlertProps[]) => void;
	pathState: any;
};

const AlertContext = createContext<AlertContextType>({
	alerts: [],
	setAlerts: _ => {},
	pathState: undefined,
});

const { Provider, Consumer } = AlertContext;

export { Provider as AlertProvider };
export { Consumer as AlertConsumer };
export default AlertContext;

let alertsSetPath = '';
let alertsCounter = 0;
// TODO FIX TYPES HERE
const onHistoryListenChange = (location: any) => {
	if (location.pathname !== alertsSetPath) {
		// Need this here because it runs more than once
		alertsCounter += 1;
		console.log(alertsSetPath, alertsCounter)
	}
};

export const useAlertContext = (initial?: AlertProps[]): AlertContextType => {
	// TODO: IN SET ALERTS, SET ALERTS PATH?
	const [alerts, internalSetAlerts] = useState<AlertProps[]>(initial ? initial : []);

	const location = useLocation();
	const history = useHistory();
	history.listen(location => {
		onHistoryListenChange(location);
	});

	const setAlerts = (newAlerts: AlertProps[]) => {
		alertsSetPath = location.pathname;
		internalSetAlerts(newAlerts);
	};
	return {
		alerts,
		setAlerts,
		pathState: { alertsSetPath, alertsCounter },
	};
};
