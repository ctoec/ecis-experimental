import { createContext, useState, Dispatch, SetStateAction } from 'react';
import { AlertProps } from '../../components/Alert/Alert';

export type AlertContextType = { 
	alerts: AlertProps[],
	setAlerts: Dispatch<SetStateAction<AlertProps[]>>
};

const AlertContext = createContext<AlertContextType>({
	alerts: [],
	setAlerts: (_) => {}
});

const { Provider, Consumer } = AlertContext;

export { Provider as AlertProvider };
export { Consumer as AlertConsumer };
export default AlertContext;

export const useAlertContext = (initial?: AlertProps[]): AlertContextType => {
	const [alerts, setAlerts] = useState<AlertProps[]>(initial ? initial : []);
	return {alerts, setAlerts};
}

