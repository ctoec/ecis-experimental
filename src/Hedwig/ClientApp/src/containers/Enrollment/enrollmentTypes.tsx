import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment } from '../../generated';
import { Mutate } from '../../hooks/useApi';
import { DeepNonUndefineable } from '../../utils/types';

export type SectionProps = {
	enrollment: DeepNonUndefineable<Enrollment> | null;
	mutate: Mutate<Enrollment>;
	callback?: (e: Enrollment) => void;
	siteId?: string;
};

export interface Section {
	key: string;
	name: string;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
}
