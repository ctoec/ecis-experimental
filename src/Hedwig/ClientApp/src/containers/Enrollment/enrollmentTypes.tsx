import { StepStatus } from '../../components/StepList/StepList';
import { Enrollment, DefaultApi } from '../../OAS-generated';
import { Mutate } from '../../hooks/useApi';

export type SectionProps = {
	enrollment?: Enrollment | null;
	mutate: Mutate<Enrollment>;
	siteId?: string;
};

export interface Section {
	key: string;
	name: string;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
}
