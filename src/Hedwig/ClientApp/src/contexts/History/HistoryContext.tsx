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
		// If there is only a hash change, do not add new location fiber.
		if (locationFiber.current.pathname === location.pathname) {
			return;
		}
		// Create the next location fiber
		// Set current to the incoming location
		// Set previous to the heretofore current location
		let nextLocationFiber: LocationFiber = {
			current: location,
			previous: locationFiber,
		};
		// If the incoming location is the heretofore current's previous location
		// we have entered a close-looped cycle. Avoid this by setting the next fiber
		// to the previous entry to allow access the previous history path.
		if (locationFiber.previous?.current.pathname === location.pathname) {
			nextLocationFiber = locationFiber.previous;
		}
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
