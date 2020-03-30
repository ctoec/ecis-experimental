import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment } from '../../generated';
import { DeepNonUndefineable } from '../../utils/types';
import { ApiError } from '../../hooks/newUseApi';

export type SectionProps = {
	enrollment: DeepNonUndefineable<Enrollment> | null;
	error: ApiError | null;
	successCallback?: (e: Enrollment) => void;
	siteId: number;
	visitSection?: (s: Section) => void;
	visitedSections?: { [key: string]: boolean };
};

export interface Section {
	key: string;
	name: string;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
}
