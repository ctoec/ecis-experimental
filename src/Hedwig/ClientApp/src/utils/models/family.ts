import { Family } from "../../generated";
import InlineIcon from "../../components/InlineIcon/InlineIcon";

export function addressFormatter(family?: Family) {
  if(!family) {
    return ['']
  }
  var street = family.addressLine1 ? family.addressLine1 : '';
  var town = family.town ? family.town : '';
  var state = family.state ? family.state : '';
  var zip = family.zip ? family.zip : '';

  if (!street && !town && !state && !zip) {
    return ['']
  }
  var fullAddress = `${street}, ${town}, ${state} ${zip}`;
  if(!street || !town || !state || !zip) {
    return [fullAddress, InlineIcon({icon: 'incomplete'})];
  }

  return [fullAddress, '']
}

export function homelessnessText() {
  return 'Family has experienced homelessness or housing insecurity';
}

export function fosterText() {
  return 'Child lives with foster family';
}