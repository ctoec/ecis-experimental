import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment } from '../../generated';
import { DeepNonUndefineable } from '../../utils/types';
import { ApiError } from '../../hooks/useApi';
import { SetStateAction, Dispatch } from 'react';

export type SectionProps = {
	enrollment: DeepNonUndefineable<Enrollment> | null;
	updateEnrollment: Dispatch<SetStateAction<DeepNonUndefineable<Enrollment> | null>>;
	error: ApiError | null;
	successCallback?: (e: Enrollment) => void;
	success?: boolean;
	loading?: boolean;
	siteId: number;
	visitSection?: (s: Section) => void;
	visitedSections?: { [key: string]: boolean };
};

export interface Section {
	key: string;
	name: string;
	isUpdate?: boolean;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
	UpdateForm?: React.FC<SectionProps>;
}
