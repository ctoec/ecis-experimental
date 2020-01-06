export function processBlockingValidationErrors(field: string, errors?: { [key: string]: Array<string>; } | null) {
  if(!errors) {
    return undefined;
  }

  const error = Object.entries(errors).find(([key]) => key.toUpperCase() === field.toUpperCase());

  if(error) {
    const [_, messages] = error;
    // For now, just return the first blocking validation error message
    return messages[0];
  }
}