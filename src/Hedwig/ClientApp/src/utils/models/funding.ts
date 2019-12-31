import { Funding } from '../../generated';
import { DeepNonUndefineable } from '../types';

export const currentFunding = (fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined => {
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.lastReportingPeriodId === undefined);
}