import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../contexts/User/UserContext';
import useApi from '../../hooks/useApi';
import { getIdForUser } from '../../utils/models';
import { Enrollment } from '../../generated';
import CommonContainer from '../CommonContainer';
import { Suspend } from '../../components/Suspend/Suspend';
import { SideNav, InlineIcon, Button, TextWithIcon, TextInput } from '../../components';
import { nameFormatter, lastFirstNameFormatter } from '../../utils/stringFormatters';
import { SideNavItemProps } from '../../components/SideNav/SideNavItem';
import { hasValidationErrors } from '../../utils/validations';
import StepList from '../../components/StepList/StepList';
import { ReactComponent as ArrowRight } from '../../assets/images/arrowRight.svg';


type BatchEditProps = {

};
export default function BatchEdit({

}: BatchEditProps) {
	const { user } = useContext(UserContext);

	const { data: enrollments, loading, error } = useApi<Enrollment[]>(
		(api) => 
			api.apiOrganizationsOrgIdEnrollmentsGet({
				orgId: getIdForUser(user, 'org'),
				include: ['child', 'fundings', 'sites']
			})
	);

	const needInfoEnrollments = enrollments?.filter(enrollment => (enrollment.validationErrors || []).length > 0);

	const [mutatedEnrollments, setMutatedEnrollments] = useState(enrollments);

	const [activeEnrollmentIdx, setActiveEnrollmentIdx] = useState<number|undefined>(0);

	return (
		<CommonContainer backHref="/roster" backText="Back to program roster">
			<div className="grid-container">
				<h1>Add needed information</h1>
				<Suspend waitFor={!loading} fallback={<div>Loading...</div>}>
					<p className="usa-intro">{needInfoEnrollments?.length} enrollments have missing or incomplete infor required to submit reports</p>
					<TextInput
						label="index"
						id="index"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							let idx: number | undefined = parseInt(e.target.value);
							idx = isNaN(idx) ? undefined : idx;
							setActiveEnrollmentIdx(idx)}
						}
					/>
						<SideNav
							externalActiveItemIndex={activeEnrollmentIdx}
							noActiveItemContent={
								<div>
									<InlineIcon icon="complete"/>
									<p>All enrollments are complete!</p>
									<Button
										appearance="unstyled"
										className="text-bold text-underline"
										text={<TextWithIcon text="Back to roster" Icon={ArrowRight} direction="right" iconSide="right" /> }
									/>
								</div>
							}
							items={
								(needInfoEnrollments || []).map((enrollment, idx) => ({
									titleLink: { 
										text: lastFirstNameFormatter(enrollment.child),
										link: ``,
									},
									description: getMissingInfoFields(enrollment),
									icon: !hasValidationErrors(enrollment) ? "complete" : undefined,
									onClick: () => {setActiveEnrollmentIdx(idx)},
									content: <h2>{lastFirstNameFormatter(enrollment.child)}</h2>
								} as SideNavItemProps))
							}
						/>			
				</Suspend>
			</div>
		</CommonContainer>
	)

}

const getMissingInfoFields = (enrollment: Enrollment) => {
	return hasValidationErrors(enrollment)
		? 'Birth certificate id, income determination'
		: 'No needed information';
}
