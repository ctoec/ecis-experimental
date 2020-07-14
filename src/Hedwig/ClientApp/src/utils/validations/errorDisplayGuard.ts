import { FormStatusProps } from '@ctoec/component-library';

export function errorDisplayGuard(blockErrorDisplay: boolean, error?: FormStatusProps) {
	if (blockErrorDisplay) {
		return undefined;
	} else {
		return error;
	}
}
