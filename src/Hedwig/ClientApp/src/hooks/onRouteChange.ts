import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function onRouteChange(callback: () => any) {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
		callback();
	}, [pathname]);
	return null;
}
