import { Organization, FundingSpace } from "../OAS-generated";

export default function getFundingSpaceCapacity(organization: Organization|undefined, source?: string, age?: string): number | undefined {
  if(!organization) return;
  if(!organization.fundingSpaces) return;

  let fundingSpaces = organization.fundingSpaces;

  if(source) {
    fundingSpaces = fundingSpaces.filter(fs => fs.source === source);
  }

  if(age) {
    fundingSpaces = fundingSpaces.filter(fs => fs.ageGroup === age);
  }

  let capacity = 0;
  fundingSpaces.forEach(fs => {
    if(fs.capacity) capacity += fs.capacity;
  });

  return capacity;
}