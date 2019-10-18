import { useContext } from 'react';
import { useQuery, QueryHookOptions } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import LoginContext from '../contexts/Login/LoginContext';
import { QueryResult } from '@apollo/react-common';

export default <T>(query: DocumentNode, options: QueryHookOptions = {}): QueryResult<T> => {
  const { accessToken } = useContext(LoginContext);

  return useQuery<T>(query, {
    ...options,
    context: {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    },
    fetchPolicy: 'cache-and-network'
  });
}
