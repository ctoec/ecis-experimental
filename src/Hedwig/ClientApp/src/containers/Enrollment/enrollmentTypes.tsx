import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment } from '../../generated';
import { ApiError } from '../../hooks/useApi';

export type SectionProps = {
	siteId: number;
	enrollment: Enrollment | null;
	updateEnrollment: React.Dispatch<React.SetStateAction<Enrollment | null>>;
	error: ApiError | null;
	successCallback?: (e: Enrollment) => void;
	triggerSave?: () => void;
	onSkip?: (e: Enrollment) => void;
	success?: boolean;
	loading?: boolean;
	onSectionTouch?: (s: Section) => void;
	touchedSections?: { [key: string]: boolean };
};

export interface Section {
	key: string;
	name: string;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
	UpdateForm?: React.FC<SectionProps>;
}
