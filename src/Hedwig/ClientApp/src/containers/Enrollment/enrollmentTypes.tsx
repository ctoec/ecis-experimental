import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment } from '../../OAS-generated';

export type SectionProps = {
	enrollment?: Enrollment | null;
	siteId?: string;
	afterSave?: (enrollment: Enrollment) => void;
};

export interface Section {
	key: string;
	name: string;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
}
