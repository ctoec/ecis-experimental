import { Age } from "../generated";

export function ageFromString(str: string) {
  switch (str) {
    case Age.Infant:
      return Age.Infant;
    case Age.Preschool:
      return Age.Preschool;
    case Age.School:
      return Age.School;
    default:
      return null;
  }
};

export function prettyAge(age: Age | null | undefined) {
  switch (age) {
    case Age.Infant:
      return 'Infant/Toddler';
    case Age.Preschool:
      return 'Preschool';
    case Age.School:
      return 'School-age';
    default:
      return '';
  }
};
