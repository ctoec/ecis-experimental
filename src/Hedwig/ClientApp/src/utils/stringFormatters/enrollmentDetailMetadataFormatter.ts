import { Enrollment, User } from "../../generated";
import { DeepNonUndefineable } from "../types";
import moment from "moment";

export function enrollmentDetailMetadataFormatter(
  enrollment: DeepNonUndefineable<Enrollment>
) {
  const formattedName = authorNameFormatter(enrollment.author);
  const formattedUpdatedAt = updatedAtFormatter(enrollment.updatedAt);
  if(formattedName != null && formattedUpdatedAt != null) {
    return `Last updated on ${formattedUpdatedAt} by ${formattedName}`;
  }

  return '';
}

function authorNameFormatter(author: User | null) {
  if(author && author.firstName && author.lastName)
  {
    return `${author.firstName[0]}. ${author.lastName}`;
  }

  return null;
}

function updatedAtFormatter(updatedAt: Date | null) {
  if(updatedAt) {
    return moment(updatedAt).format('MMMM Do, YYYY');
  }

  return null;
}