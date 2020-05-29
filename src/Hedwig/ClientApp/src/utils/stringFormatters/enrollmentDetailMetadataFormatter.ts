import { Enrollment, User } from '../../generated';
import moment from 'moment';

export function enrollmentDetailMetadataFormatter(enrollment: Enrollment) {
	const formattedName = authorNameFormatter(enrollment.author);
	const formattedUpdatedAt = updatedAtFormatter(enrollment.updatedAt);
	if (formattedName != null && formattedUpdatedAt != null) {
		return `Last updated on ${formattedUpdatedAt} by ${formattedName}`;
	}

	return '';
}

function authorNameFormatter(author: User | null | undefined) {
	if (author && author.firstName && author.lastName) {
		return `${author.firstName[0]}. ${author.lastName}`;
	}

	return null;
}

function updatedAtFormatter(updatedAt: Date | null | undefined) {
	if (updatedAt) {
		return moment(updatedAt).format('MMMM Do, YYYY');
	}

	return null;
}
