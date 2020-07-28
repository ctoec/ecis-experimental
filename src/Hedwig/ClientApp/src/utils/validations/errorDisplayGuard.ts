import { FormStatusProps } from '../../components/FormStatus/FormStatus';

export function errorDisplayGuard(blockErrorDisplay: boolean, error?: FormStatusProps) {
	if (blockErrorDisplay) {
		return undefined;
	} else {
		return error;
	}
}
