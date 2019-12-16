import { Gender } from '../../generated';

export function genderFromString(str: string) {
  switch (str) {
    case Gender.Female:
      return Gender.Female;
    case Gender.Male:
      return Gender.Male;
    case Gender.Unknown:
      return Gender.Unknown;
    default:
      return Gender.Unspecified;
  }
};

export function prettyGender(gender: Gender) {
  switch (gender) {
    case Gender.Female:
      return 'Female';
    case Gender.Male:
      return 'Male';
    case Gender.Unknown:
      return 'Unknown';
    default:
      return '';
  }
};

