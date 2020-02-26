import { FormStatusProps } from '../../components/FormStatus/FormStatus';

export function initialLoadErrorGuard(initialLoad: boolean, error?: FormStatusProps) {
	if (initialLoad) {
		return undefined;
	} else {
		return error;
	}
}
