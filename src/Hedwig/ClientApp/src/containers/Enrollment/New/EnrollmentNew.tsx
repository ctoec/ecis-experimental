import React from 'react';
import useAuthQuery from '../../../hooks/useAuthQuery';
import { Section } from '../enrollmentTypes';
import { CHILD_QUERY } from '../enrollmentQueries';
import { ChildQuery } from '../../../generated/ChildQuery';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';

type EnrollmentNewParams = {
	match: {
		params: {
			siteId?: string;
			childId?: string;
			sectionId?: string;
		};
	};
};

const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];

const mapSectionsToSteps = (
	sections: Section[],
	sectionId: string,
	childId: string | undefined
) => {
	return sections;
};

export default function EnrollmentNew({
	match: {
		params: { siteId, childId, sectionId = 'child-details' },
	},
}: EnrollmentNewParams) {
	if (!siteId && !childId) {
		throw new Error('EnrollmentNew rendered without siteId or childId parameters');
	}

	const { loading, error, data } = useAuthQuery<ChildQuery>(CHILD_QUERY, {
		variables: { id: childId },
		skip: !childId,
	});

	if (loading || error) {
		return <div className="EnrollmentNew"></div>;
	}

	const steps = mapSectionsToSteps(sections, sectionId, childId);

	return (
		<div className="EnrollmentNew">
			<section className="grid-container">
				<h1>Enroll child</h1>
			</section>
		</div>
	);
}
