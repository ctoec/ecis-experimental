import React, { useContext, ReactElement } from 'react';
import UserContext from '../../contexts/User/UserContext';
import { useHistory } from 'react-router';

type NotSignedInRedirectProps = {};

export const NotSignedInRedirect = ({ children }: { children: ReactElement }) => {
	const history = useHistory();
	const { loading, user } = useContext(UserContext);
	console.log(loading, user);
	if (history.location.pathname === '/') {
		return children;
	}
	if (loading) {
		return <></>;
	} else {
		if (!user) {
			// window.location.pathname = '/';
			history.push('/');
			return <></>;
		} else {
			return children;
		}
	}
};

export default NotSignedInRedirect;
