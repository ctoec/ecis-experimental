import React, { useEffect } from 'react';
import { FundingSpace, Enrollment } from '../../../../../../generated';
import { prettyFundingSpaceTime } from '../../../../../../utils/models';
import { Select, SelectProps } from '../../../../../../components';
import FormField from '../../../../../../components/Form_New/FormField';
import FormContext, { useGenericContext } from '../../../../../../components/Form_New/FormContext';
import produce from 'immer';
import set from 'lodash/set';
import { FundingFormFieldProps } from '../common';
import { displayValidationStatus } from '../../../../../../utils/validations/displayValidationStatus';
import { REQUIRED_FOR_OEC_REPORTING } from '../../../../../../utils/validations/messageStrings';

export const ContractSpaceField: React.FC<FundingFormFieldProps> = ({
	fundingId,
	fundingSpaces: matchingFundingSpaces,
	error,
	errorAlertState,
}) => {
	if (matchingFundingSpaces.length === 1) {
		return (
			<SingleContractSpaceField fundingId={fundingId} fundingSpace={matchingFundingSpaces[0]} />
		);
	}

	return (
		<FormField<Enrollment, SelectProps, number | null>
			getValue={(data) =>
				data
					.at('fundings')
					.find((funding) => funding.id === fundingId)
					.at('fundingSpaceId')
			}
			parseOnChangeEvent={(e) => parseInt((e.target as HTMLInputElement).value)}
			inputComponent={Select}
			id="funding-contract-space-select"
			label="Contract space"
			options={matchingFundingSpaces.map((space) => ({
				text: prettyFundingSpaceTime(space, true),
				value: `${space.id}`,
			}))}
			status={(_) =>
				displayValidationStatus([
					{
						type: 'error',
						response: error,
						field: 'fundings.fundingSpaceId',
						message: REQUIRED_FOR_OEC_REPORTING,
						errorAlertState,
					},
				])
			}
		/>
	);
};

type SingleContractSpaceFieldProps = {
	fundingId: number;
	fundingSpace: FundingSpace;
};

// This renders if there's only one valid funding space option for the given funding source
const SingleContractSpaceField: React.FC<SingleContractSpaceFieldProps> = ({
	fundingId,
	fundingSpace,
}) => {
	const { dataDriller, updateData } = useGenericContext<Enrollment>(FormContext);

	useEffect(() => {
		updateData((_data) =>
			produce<Enrollment>(_data, (draft) =>
				set(
					draft,
					dataDriller
						.at('fundings')
						.find((f) => f.id === fundingId)
						.at('fundingSpaceId').path,
					fundingSpace.id
				)
			)
		);
	}, []);

	return (
		<div>
			<span className="usa-hint text-italic">
				{prettyFundingSpaceTime(fundingSpace, true /*include weeks*/)}
			</span>
		</div>
	);
};
