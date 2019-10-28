import moment from "moment";

export default function getDefaultDateRange() {
  return {
    startDate: moment().local(),
    endDate: moment().local(),
  };
}