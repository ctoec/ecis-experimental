import React from 'react';
import useAuthQuery from '../../../hooks/useAuthQuery';
import { CHILD_QUERY } from '../enrollmentQueries';
import { ChildQuery } from '../../../generated/ChildQuery';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { Link } from 'react-router-dom';
import nameFormatter from '../../../utils/nameFormatter';

type EnrollmentDetailParams = {
	match: {
		params: {
			childId: string;
		};
	};
};

const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];

export default function EnrollmentDetail({
	match: {
		params: { childId },
	},
}: EnrollmentDetailParams) {
	const { loading, error, data } = useAuthQuery<ChildQuery>(CHILD_QUERY, {
		variables: { id: childId },
	});

	if (loading || error || !data || !data.child) {
		return <div className="EnrollmentEdit"></div>;
	}

	const child = data.child;

	return (
		<div className="EnrollmentDetail">
			<section className="grid-container">
				<h1>{nameFormatter(child)}</h1>
				{sections.map(section => (
					<section key={section.key} className="hedwig-enrollment-details-section">
						<div className="hedwig-enrollment-details-section__content">
							<h2>{section.name}</h2>
							<section.Summary child={child} />
						</div>
						<div className="hedwig-enrollment-details-section__actions">
							<Link to={`edit/${section.key}`}>
								Edit<span className="usa-sr-only"> {section.name.toLowerCase()}</span>
							</Link>
						</div>
					</section>
				))}
			</section>
		</div>
	);
}
