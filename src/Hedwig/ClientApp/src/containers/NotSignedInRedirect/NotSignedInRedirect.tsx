import React, { useContext } from 'react';
import UserContext from '../../contexts/User/UserContext';
import { useHistory } from 'react-router';

type NotSignedInRedirectProps = {};

export const NotSignedInRedirect: React.FC<NotSignedInRedirectProps> = ({ children }) => {
	const history = useHistory();
	const { loading, user } = useContext(UserContext);

	if (loading) {
		return <></>;
	} else {
		if (!user) {
			history.push('/');
			return <></>;
		} else {
			return <>{children}</>;
		}
	}
};

export default NotSignedInRedirect;
