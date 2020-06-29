import { FundingSpace } from '../../../../../generated';
import { ErrorAlertState } from '../../../../../hooks/useCatchAllErrorAlert';
import { ApiError } from '../../../../../hooks/useApi';

export type EnrollmentFormFieldProps = {
	blockErrorDisplay?: boolean;
	error: ApiError | null;
	errorAlertState?: ErrorAlertState;
};

export type FundingFormFieldProps = {
	fundingId: number;
	fundingSpaces: FundingSpace[];
	error: ApiError | null;
	errorAlertState?: ErrorAlertState;
};

export type C4kCertificateFormFieldProps = {
	certificateId: number;
	blockErrorDisplay?: boolean;
};
