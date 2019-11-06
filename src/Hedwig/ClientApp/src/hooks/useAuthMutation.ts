import { useContext, useEffect } from 'react';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import LoginContext from '../contexts/Login/LoginContext';

export default <T>(mutation: DocumentNode, options: MutationHookOptions = {}) => {
	const { accessToken, withFreshToken } = useContext(LoginContext);

	useEffect(() => {
		withFreshToken();
	});

	return useMutation<T>(mutation, {
		...options,
		context: {
			headers: {
				Authorization: accessToken ? `Bearer ${accessToken}` : '',
			},
		},
	});
};
