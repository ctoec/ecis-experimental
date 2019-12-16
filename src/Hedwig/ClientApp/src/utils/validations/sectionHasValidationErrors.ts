import { Validatable, hasValidationErrors } from '.';

export function sectionHasValidationErrors(sectionObjects: Validatable[]) {
  let hasErrors = false;
  sectionObjects.forEach(o => {
    if(!o) return;

    hasErrors = hasValidationErrors(o) && !hasErrors;
  });

  return hasErrors;
}