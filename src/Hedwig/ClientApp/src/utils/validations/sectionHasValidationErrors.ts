import { Validatable, hasValidationErrors } from '.';

export function sectionHasValidationErrors(sectionObjects: (Validatable | Validatable[] | null)[]) {
  let hasErrors = false;
  sectionObjects.forEach(sectionObject => {
    if (!sectionObject) return;

    if (Array.isArray(sectionObject)) {
      hasErrors = sectionObject.some(hasValidationErrors) && !hasErrors;
    } else {
      hasErrors = hasValidationErrors(sectionObject) && !hasErrors;
    }
  });

  return hasErrors;
}