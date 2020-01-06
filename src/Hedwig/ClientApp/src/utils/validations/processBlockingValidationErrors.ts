export function processBlockingValidationErrors(field: string, errors?: { [key: string]: Array<string>; } | null) {
  if(!errors) {
    return undefined;
  }

  const fieldRegex = new RegExp(field.split('.').join('.*'), 'i');
  const error = Object.entries(errors).find(([key]) => key.match(fieldRegex));

  if(error) {
    const [_, messages] = error;
    // For now, just return the first blocking validation error message
    return messages[0];
  }
}