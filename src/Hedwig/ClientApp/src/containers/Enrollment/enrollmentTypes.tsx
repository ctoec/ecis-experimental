export type SectionStatus = 'incomplete' | 'complete' | 'attentionNeeded';
import { ChildQuery_child } from '../../generated/ChildQuery';

export interface Section {
	id: string;
	name: string;
	status: (child: ChildQuery_child) => SectionStatus;
	Summary: React.FC<{ child: ChildQuery_child }>;
	Form: React.FC<{ child?: ChildQuery_child; siteId?: number; afterSave: () => void }>;
}
