import idx from 'idx';
import { Enrollment } from '../generated/models/Enrollment';

// TODO
// Hack to fake missing information on enrollment entities
// for now: returns if child.birthCertificate not set
export default function missingInformation(enrollment: Enrollment): boolean {
	return !!!idx(enrollment, _ => _.child.birthCertificateId);
};
