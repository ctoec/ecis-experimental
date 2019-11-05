import React from 'react';
import useAuthQuery from '../../../hooks/useAuthQuery';
import { Section } from '../enrollmentTypes';
import { History } from 'history';
import { CHILD_QUERY } from '../enrollmentQueries';
import { ChildQuery } from '../../../generated/ChildQuery';
import ChildInfo from '../_sections/ChildInfo';
// import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import PageNotFound from '../../PageNotFound/PageNotFound';

type EnrollmentEditParams = {
	history: History;
	match: {
		params: {
			childId: string;
			sectionId: string;
		};
	};
};

const sections: { [key: string]: Section } = {
	'child-information': ChildInfo,
	// 'family-information': FamilyInfo,
	'family-income': FamilyIncome,
	'enrollment-funding': EnrollmentFunding,
};

export default function EnrollmentEdit({
	history,
	match: {
		params: { childId, sectionId },
	},
}: EnrollmentEditParams) {
	const { loading, error, data } = useAuthQuery<ChildQuery>(CHILD_QUERY, {
		variables: { id: childId },
	});

	const section = sections[sectionId];

	if (!section) {
		return <PageNotFound />;
	}

	if (loading || error || !data || !data.child) {
		return <div className="EnrollmentEdit"></div>;
	}

	const afterSave = () => {
		history.push(`/roster/enrollments/${childId}/`);
	};

	return (
		<div className="EnrollmentEdit">
			<section className="grid-container">
				<h1>Edit {section.name.toLowerCase()}</h1>
				<section.Form child={data.child} afterSave={afterSave} />
			</section>
		</div>
	);
}
