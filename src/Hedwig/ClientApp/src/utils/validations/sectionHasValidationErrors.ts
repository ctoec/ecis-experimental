import { Validatable, hasValidationErrors } from '.';

export function sectionHasValidationErrors(sectionObjects: (Validatable | Validatable[] | null)[]) {
  let hasErrors = false;
  sectionObjects.forEach(o => {
    if (!o) return;

    if (Array.isArray(o)) {
      hasErrors = o.some(hasValidationErrors) && !hasErrors;
    } else {
      hasErrors = hasValidationErrors(o) && !hasErrors;
    }
  });

  return hasErrors;
}