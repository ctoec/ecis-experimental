export function processBlockingValidationErrors(field: string, errors?: { [key: string]: Array<string>; } | null) {
  if(!errors) {
    return undefined;
  }

  // This matches object fields that are contained in an array
  // e.g. fundings[1].familyid
  const fieldRegex = new RegExp(`^${field.split('.').join('(\\[.*\\])?.?')}$`, 'i');
  const error = Object.entries(errors).find(([key]) => key.match(fieldRegex));

  if(error) {
    const [, messages] = error;
    // For now, just return the first blocking validation error message
    return messages[0];
  }
}