import { gql } from 'apollo-boost';

export const CHILD_QUERY = gql`
	query ChildQuery($id: ID!) {
		child(id: $id) {
			id
			firstName
			middleName
			lastName
			suffix
			family {
				id
				caseNumber
			}
		}
	}
`;
