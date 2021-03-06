import { ErrorAlertState } from '../../../../../hooks/useCatchAllErrorAlert';
import { ValidationResponse } from '../../../../../utils/validations/displayValidationStatus';

// Copied from child info-- probably can be consolidated?
export type FamilyInfoFormFieldProps = {
	blockErrorDisplay?: boolean;
	error?: ValidationResponse | null;
	errorAlertState?: ErrorAlertState;
};
