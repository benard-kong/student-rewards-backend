import moment from "moment";

/**
 * @param {String} startDate
 * @param {String} endDate
 * @returns {moment.Moment[]}
 */
export default function getStartEndDates(startDate, endDate) {
  let _startDate = moment(0);
  if (startDate) _startDate = moment(startDate);
  let _endDate = moment();
  if (endDate) _endDate = moment(endDate).add(1, "days"); // Add one day to end date to include the entire day as well
  if (!_startDate.isValid()) throw new Error("Invalid start date");
  if (!_endDate.isValid()) throw new Error("Invalid end date");

  return [_startDate, _endDate];
}
