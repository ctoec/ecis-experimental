import { Moment } from 'moment';

export default function(inputDate: Moment) {
  return inputDate.format('YYYY-MM-DD');
}
