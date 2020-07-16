import React, { useEffect } from 'react';
import { Enrollment } from '../../../../../generated';
import produce from 'immer';
import set from 'lodash/set';
import moment from 'moment';
import { useGenericContext, FormContext } from '@ctoec/component-library';

const MOVED_WITHIN_PROGRAM = 'Moved within program';

type EnrollmentEndDateFieldProps = {
	newEnrollmentStartDate?: Date;
};

/**
 * This component is used in EnrollmentUpdate when creating a new enrollment
 * to end the previously current enrollment.
 *
 * It is not displayed to the user, and does not require any user input.
 *
 * Instead, it sets the previously current enrollment's end date to the
 * provided start date from the new enrollment.
 *
 * It also sets the exit reason to "Moved within program".
 */
export const EnrollmentEndDateField: React.FC<EnrollmentEndDateFieldProps> = ({
	newEnrollmentStartDate,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);

	useEffect(() => {
		// If start date for new enrollment is provided, update previously current enrollment
		if (newEnrollmentStartDate) {
			// Compute exit date (one day before new enrollment start date)
			const exitDate = moment.utc(newEnrollmentStartDate).add(-1, 'days').toDate();
			// Update previously current enrollment, if update needed
			// (skip unnecessary update + render when value is already set)
			if (dataDriller.at('exit').value != exitDate) {
				updateData((_data) =>
					produce<Enrollment>(_data, (draft) => set(draft, dataDriller.at('exit').path, exitDate))
				);

				// and set the previously current enrollment exit reason to "moved within program"
				updateData((_data) =>
					produce<Enrollment>(_data, (draft) =>
						set(draft, dataDriller.at('exitReason').path, MOVED_WITHIN_PROGRAM)
					)
				);
			}
		}
	}, [newEnrollmentStartDate]);

	return <> </>;
};
