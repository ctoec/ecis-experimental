import React, { useContext, PropsWithChildren } from 'react';
import UserContext from '../../contexts/User/UserContext';
import { useHistory } from 'react-router';

type NotSignedInRedirectProps = {};

export const NotSignedInRedirect = ({ children }: PropsWithChildren<NotSignedInRedirectProps>) => {
	const history = useHistory();
	const { loading, user } = useContext(UserContext);
	if (loading) {
		return <></>;
	} else {
		if (!user) {
			history.push('/');
			return <></>;
		} else {
			return children;
		}
	}
};

export default NotSignedInRedirect;
