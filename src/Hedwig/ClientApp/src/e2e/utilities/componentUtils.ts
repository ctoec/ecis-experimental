// These utilities are specific to the structure of the components in our library

export const getTextInputByLabelSelector = (label: string) => {
  return `//*/label[text()[contains(.,'${label}')]]//following-sibling::input`;
}