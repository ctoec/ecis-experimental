import React, { createContext, useState, useEffect } from 'react';
import { History, Location, createLocation } from 'history';
import { useLocation } from 'react-router';

export type HistoryContextType = {
	previousLocation: Location<History.PoorMansUnknown>;
};

const HistoryContext = createContext<HistoryContextType>({
	previousLocation: createLocation('/'),
});

const { Provider, Consumer } = HistoryContext;

type LocationFiber = {
	current: Location<History.PoorMansUnknown>;
	previous?: LocationFiber;
};

export const HistoryProvider: React.FC = ({ children }) => {
	const location = useLocation();
	const defaultLocation = createLocation('/');
	const defaultFiber: LocationFiber = {
		current: defaultLocation,
	};
	const [locationFiber, setLocationFiber] = useState<LocationFiber>(defaultFiber);

	useEffect(() => {
		// Create the next location fiber
		// Set current to the incoming location
		// Set previous to the heretofore current location
		// Set previous.previous to undefined to allow GC
		const nextLocationFiber: LocationFiber = {
			current: location,
			previous: {
				...locationFiber,
				previous: undefined,
			},
		};
		setLocationFiber(nextLocationFiber);
	}, [location]);

	return (
		<Provider value={{ previousLocation: locationFiber.previous?.current || defaultLocation }}>
			{children}
		</Provider>
	);
};

export { Consumer as HistoryConsumer };
export default HistoryContext;
