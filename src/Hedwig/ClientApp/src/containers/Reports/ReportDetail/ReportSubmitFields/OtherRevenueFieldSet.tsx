import React from 'react';
import { Enrollment } from '../../../../generated';
import { ValidationResponse } from '../../../../utils/validations/displayValidationStatus';
import { ErrorAlertState } from '../../../../hooks/useCatchAllErrorAlert';
import { FieldSet } from '../../../../components';
import { C4KRevenueField } from './C4KRevenue';
import { RetroactiveC4KRevenue } from './RetroactiveC4KRevenue';
import { FamilyFeesRevenueField } from './FamilyFeesRevenue';
import { CommentField } from './Comment';

type OtherRevenueFieldSetProps = {
	disabled: boolean;
	enrollments: Enrollment[];
	submittedAt: Date | undefined;
	error?: ValidationResponse | null;
	errorAlertState?: ErrorAlertState;
};

export const OtherRevenueFieldSet: React.FC<OtherRevenueFieldSetProps> = ({
	disabled,
	enrollments,
	submittedAt,
	error,
	errorAlertState,
}) => {
	return (
		<FieldSet id="other-revenue" legend="Other Revenue">
			<div className="mobile-lg:grid-col-12">
				<C4KRevenueField
					disabled={disabled}
					enrollments={enrollments}
					submittedAt={submittedAt || undefined}
					error={error}
					errorAlertState={errorAlertState}
				/>
			</div>
			<RetroactiveC4KRevenue disabled={disabled} />
			<div className="mobile-lg:grid-col-12">
				<FamilyFeesRevenueField
					disabled={disabled}
					error={error}
					errorAlertState={errorAlertState}
				/>
			</div>
			<div className="mobile-lg:grid-col-12">
				<CommentField disabled={disabled} />
			</div>
		</FieldSet>
	);
};
