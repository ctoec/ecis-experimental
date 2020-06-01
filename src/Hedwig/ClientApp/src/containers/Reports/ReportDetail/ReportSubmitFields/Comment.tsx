import React from 'react';
import { FormField } from '../../../../components/Form_New';
import { TextInputProps, TextInput } from '../../../../components';
import { CdcReport } from '../../../../generated';

type CommentFieldProps = {
	disabled: boolean;
};

export const CommentField: React.FC<CommentFieldProps> = ({ disabled }) => {
	return (
		<FormField<CdcReport, TextInputProps, string | null>
			getValue={(data) => data.at('comment')}
			parseOnChangeEvent={(e) => e.target.value}
			inputComponent={TextInput}
			id="cdc-report-comment"
			type="textarea"
			label={
				<span className="text-bold">
					Anything to share with the Office of Early Childhood about your report?
				</span>
			}
			disabled={disabled}
			optional
		/>
	);
};
