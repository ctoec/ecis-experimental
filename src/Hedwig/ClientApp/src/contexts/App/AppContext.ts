import { createContext, useState } from 'react';

export type AppContextType = { 
	cacheInvalidator: number,
	invalidateCache: () => void
};

const AppContext = createContext<AppContextType>({
	cacheInvalidator: 0,
	invalidateCache: () => {}
});

const { Provider, Consumer } = AppContext;

export const useCacheInvalidator: () => AppContextType = () => {
	const [cacheInvalidator, setCacheInvalidator] = useState(0);
  const invalidateCache = () => setCacheInvalidator((prev) => prev + 1);
	return {cacheInvalidator, invalidateCache};
}

export { Provider as AppProvider };
export { Consumer as AppConsumer };
export default AppContext;