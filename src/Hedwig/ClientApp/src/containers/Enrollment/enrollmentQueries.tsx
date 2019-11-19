import { gql } from 'apollo-boost';

const DETERMINATION_FRAGMENT = gql`
	fragment DeterminationFragment on FamilyDeterminationType {
		id
		numberOfPeople
		income
		determined
	}
`;

const FAMILY_FRAGMENT = gql`
	${DETERMINATION_FRAGMENT}
	fragment FamilyFragment on FamilyType {
		id
		addressLine1
		addressLine2
		town
		state
		zip
		homelessness
		determinations {
			...DeterminationFragment
		}
	}
`;

const FUNDING_FRAGMENT = gql`
	fragment FundingFragment on FundingType {
		id
		source
		time
	}
`;

const ENROLLMENT_FRAGMENT = gql`
	${FUNDING_FRAGMENT}
	fragment EnrollmentFragment on EnrollmentType {
		id
		entry
		exit
		age
		site {
			id
			name
		}
		fundings {
			...FundingFragment
		}
	}
`;

const CHILD_FRAGMENT = gql`
	${ENROLLMENT_FRAGMENT}
	${FAMILY_FRAGMENT}
	fragment ChildFragment on ChildType {
		id
		sasid
		firstName
		middleName
		lastName
		suffix
		birthdate
		birthTown
		birthState
		birthCertificateId
		americanIndianOrAlaskaNative
		asian
		blackOrAfricanAmerican
		nativeHawaiianOrPacificIslander
		white
		hispanicOrLatinxEthnicity
		gender
		foster
		enrollments {
			...EnrollmentFragment
		}
		family {
			...FamilyFragment
		}
	}
`;

export const CHILD_QUERY = gql`
	query ChildQuery($id: ID!) {
		child(id: $id) {
			...ChildFragment
		}
	}
	${CHILD_FRAGMENT}
`;

export const CREATE_CHILD_MUTATION = gql`
	mutation CreateChildMutation(
		$sasid: String
		$firstName: String!
		$middleName: String
		$lastName: String!
		$suffix: String
		$birthdate: String
		$birthCertificateId: String
		$birthTown: String
		$birthState: String
		$gender: Gender
		$americanIndianOrAlaskaNative: Boolean
		$asian: Boolean
		$blackOrAfricanAmerican: Boolean
		$nativeHawaiianOrPacificIslander: Boolean
		$white: Boolean
		$hispanicOrLatinxEthnicity: Boolean
		$foster: Boolean
		$siteId: Int!
	) {
		createChildWithSiteEnrollment(
			sasid: $sasid
			firstName: $firstName
			middleName: $middleName
			lastName: $lastName
			suffix: $suffix
			birthdate: $birthdate
			birthCertificateId: $birthCertificateId
			birthTown: $birthTown
			birthState: $birthState
			gender: $gender
			americanIndianOrAlaskaNative: $americanIndianOrAlaskaNative
			asian: $asian
			blackOrAfricanAmerican: $blackOrAfricanAmerican
			nativeHawaiianOrPacificIslander: $nativeHawaiianOrPacificIslander
			white: $white
			hispanicOrLatinxEthnicity: $hispanicOrLatinxEthnicity
			foster: $foster
			siteId: $siteId
		) {
			...ChildFragment
		}
	}
	${CHILD_FRAGMENT}
`;

export const UPDATE_CHILD_MUTATION = gql`
	mutation UpdateChildMutation(
		$id: String!
		$sasid: String
		$firstName: String!
		$middleName: String
		$lastName: String!
		$suffix: String
		$birthdate: String
		$birthCertificateId: String
		$birthTown: String
		$birthState: String
		$gender: Gender
		$americanIndianOrAlaskaNative: Boolean
		$asian: Boolean
		$blackOrAfricanAmerican: Boolean
		$nativeHawaiianOrPacificIslander: Boolean
		$white: Boolean
		$hispanicOrLatinxEthnicity: Boolean
		$foster: Boolean
	) {
		updateChild(
			id: $id
			sasid: $sasid
			firstName: $firstName
			middleName: $middleName
			lastName: $lastName
			suffix: $suffix
			birthdate: $birthdate
			birthCertificateId: $birthCertificateId
			birthTown: $birthTown
			birthState: $birthState
			gender: $gender
			americanIndianOrAlaskaNative: $americanIndianOrAlaskaNative
			asian: $asian
			blackOrAfricanAmerican: $blackOrAfricanAmerican
			nativeHawaiianOrPacificIslander: $nativeHawaiianOrPacificIslander
			white: $white
			hispanicOrLatinxEthnicity: $hispanicOrLatinxEthnicity
			foster: $foster
		) {
			...ChildFragment
		}
	}
	${CHILD_FRAGMENT}
`;

export const CREATE_FAMILY_MUTATION = gql`
	mutation CreateFamilyMutation(
		$addressLine1: String
		$addressLine2: String
		$town: String
		$state: String
		$zip: String
		$homelessness: Boolean
		$childId: String!
	) {
		createFamilyWithChild(
			addressLine1: $addressLine1
			addressLine2: $addressLine2
			town: $town
			state: $state
			zip: $zip
			homelessness: $homelessness
			childId: $childId
		) {
			...FamilyFragment
		}
	}
	${FAMILY_FRAGMENT}
`;

export const UPDATE_FAMILY_MUTATION = gql`
	mutation UpdateFamilyMutation(
		$id: Int!
		$addressLine1: String
		$addressLine2: String
		$town: String
		$state: String
		$zip: String
		$homelessness: Boolean
	) {
		updateFamily(
			id: $id
			addressLine1: $addressLine1
			addressLine2: $addressLine2
			town: $town
			state: $state
			zip: $zip
			homelessness: $homelessness
		) {
			...FamilyFragment
		}
	}
	${FAMILY_FRAGMENT}
`;

export const CREATE_FAMILY_DETERMINATION_MUTATION = gql`
	mutation CreateFamilyDeterminationMutation(
		$familyId: Int!
		$numberOfPeople: Int!
		$income: Decimal!
		$determined: String!
	) {
		createFamilyDetermination(
			familyId: $familyId
			numberOfPeople: $numberOfPeople
			income: $income
			determined: $determined
		) {
			...DeterminationFragment
		}
	}
	${DETERMINATION_FRAGMENT}
`;

export const UPDATE_FAMILY_DETERMINATION_MUTATION = gql`
	mutation UpdateFamilyDeterminationMutation(
		$id: Int!
		$numberOfPeople: Int!
		$income: Decimal!
		$determined: String!
	) {
		updateFamilyDetermination(
			id: $id
			numberOfPeople: $numberOfPeople
			income: $income
			determined: $determined
		) {
			...DeterminationFragment
		}
	}
	${DETERMINATION_FRAGMENT}
`;

export const UPDATE_ENROLLMENT_MUTATION = gql`
	mutation UpdateEnrollmentMutation($id: Int!, $entry: String, $exit: String, $age: Age) {
		updateEnrollment(id: $id, entry: $entry, exit: $exit, age: $age) {
			...EnrollmentFragment
		}
	}
	${ENROLLMENT_FRAGMENT}
`;
