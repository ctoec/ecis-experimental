import { ChildQuery_child } from '../../generated/ChildQuery';
import { StepStatus } from '../../components/StepList/StepList';

export type SectionProps = {
	child?: ChildQuery_child | null;
	siteId?: string;
	afterSave?: (child: ChildQuery_child) => void;
};

export interface Section {
	key: string;
	name: string;
	status: (props: SectionProps) => StepStatus;
	Summary: React.FC<SectionProps>;
	Form: React.FC<SectionProps>;
}
