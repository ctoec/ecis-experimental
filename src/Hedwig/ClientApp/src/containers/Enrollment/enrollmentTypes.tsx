import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment } from '../../generated';
import { ApiError } from '../../hooks/useApi';
import { SetStateAction, Dispatch } from 'react';

export const headerLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type PossibleHeaderLevels = typeof headerLevels[number];

export type SectionProps = {
	siteId: number;
	enrollment: Enrollment | null;
	updateEnrollment: Dispatch<SetStateAction<Enrollment | null>>;
	error: ApiError | null;
	startingHeaderLevel?: PossibleHeaderLevels;
	successCallback?: (e: Enrollment) => void;
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
