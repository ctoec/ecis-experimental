import React from 'react';
import useAuthQuery from '../../../hooks/useAuthQuery';
import { History } from 'history';
import { Section, SectionProps } from '../enrollmentTypes';
import { default as StepList, StepProps } from '../../../components/StepList/StepList';
import { CHILD_QUERY } from '../enrollmentQueries';
import { ChildQuery } from '../../../generated/ChildQuery';
import ChildInfo from '../_sections/ChildInfo';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import Button from '../../../components/Button/Button';

type EnrollmentNewParams = {
	history: History;
	match: {
		params: {
			siteId?: string;
			childId?: string;
			sectionId?: string;
		};
	};
};

const sections = [ChildInfo, FamilyInfo, FamilyIncome, EnrollmentFunding];

const mapSectionsToSteps = (sections: Section[]) => {
	const steps: StepProps<SectionProps>[] = sections.map(section => {
		const editPath = section.key;
		return { ...section, editPath };
	});
	return steps;
};

export default function EnrollmentNew({
	history,
	match: {
		params: { siteId, childId, sectionId = ChildInfo.key },
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

	const afterSave = () => {
		if (!data || !data.child) {
			throw new Error('EnrollmentNew called afterSave before successful save');
		}

		if (!childId) {
			history.replace(`/roster/enrollments/${data.child.id}/new/${sectionId}`);
		}

		const currentIndex = sections.findIndex(section => section.key === sectionId);

		if (currentIndex === sections.length - 1) {
			history.push(`/roster/enrollments/${data.child.id}/new/review`);
		} else {
			const nextSectionId = sections[currentIndex + 1].key;
			history.push(`/roster/enrollments/${data.child.id}/new/${nextSectionId}`);
		}
	};

	const steps = mapSectionsToSteps(sections);

	const props: SectionProps = {
		child: data && data.child ? data.child : undefined,
		siteId,
		afterSave,
	};

	return (
		<div className="EnrollmentNew">
			<section className="grid-container">
				<h1>Enroll child</h1>
				<StepList steps={steps} activeStep={sectionId} props={props} />
				{sectionId == 'review' && <Button href="../" text="Finish" />}
			</section>
		</div>
	);
}
