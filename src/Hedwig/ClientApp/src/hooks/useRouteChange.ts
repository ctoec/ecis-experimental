import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useRouteChange(callback: () => any) {
	/*
	This is a silly name but from the react hooks docs:
	"Do I have to name my custom Hooks starting with “use”? Please do. This convention is very important."
	*/
	const { pathname } = useLocation();
	useEffect(() => {
		callback();
	}, [pathname, callback]);
	return null;
}
