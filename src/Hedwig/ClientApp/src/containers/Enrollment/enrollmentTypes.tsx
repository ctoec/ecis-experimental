import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment } from '../../generated';
import { Mutate } from '../../hooks/useApi';
import { DeepNonUndefineable } from '../../utils/types';
import { ApiError } from '../../hooks/useApi';
import { AlertProps } from '../../components';

export type SectionProps = {
	enrollment: DeepNonUndefineable<Enrollment> | null;
	mutate: Mutate<Enrollment>;
	error: ApiError | null;
	successCallback?: (e: Enrollment) => void;
	finallyCallback?: (s: Section) => void;
	siteId: number;
	visitedSections?: { [key: string]: boolean };
};

export interface Section {
	key: string;
	name: string;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
}
