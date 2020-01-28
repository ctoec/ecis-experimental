import { Age } from "../../generated"
import { getObjectsByAgeGroup } from "./ageGroup";

describe('getObjectsByAgeGroup', () => {
  it('groups input objects by ageGroup', () => {
    const infantToddlerObjects = [
      {ageGroup: Age.InfantToddler}
    ];

    const preschoolObjects = [
      {ageGroup: Age.Preschool},
      {ageGroup: Age.Preschool}
    ];

    const schoolAgeObjects = [
      {ageGroup: Age.SchoolAge},
      {ageGroup: Age.SchoolAge},
      {ageGroup: Age.SchoolAge}
    ];

    const objects = [...infantToddlerObjects, ...preschoolObjects, ...schoolAgeObjects];
    const res = getObjectsByAgeGroup(objects);

    expect(res).toHaveProperty(Age.InfantToddler, infantToddlerObjects);
    expect(res).toHaveProperty(Age.Preschool, preschoolObjects);
    expect(res).toHaveProperty(Age.SchoolAge, schoolAgeObjects);
  })
})