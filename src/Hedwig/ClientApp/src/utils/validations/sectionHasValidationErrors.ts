import { Validatable, hasValidationErrors } from '.';

export function sectionHasValidationErrors(sectionObjects: (Validatable | Validatable[] | null)[]) {
  let hasErrors = false;
  sectionObjects.forEach(sectionObject => {
    if (!sectionObject) return;

    if (Array.isArray(sectionObject)) {
      hasErrors = sectionObject.some(item => hasValidationErrors(item, undefined, true)) || hasErrors;
    } else {
      hasErrors = hasValidationErrors(sectionObject, undefined, true) || hasErrors;
    }
  });

  return hasErrors;
}
