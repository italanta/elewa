import moment from "moment";

export function check24HoursPassed(lastMessageTime: moment.Moment): boolean {
  // Calculate the difference between now and the input time in hours
  const hoursDifference = moment().diff(lastMessageTime, 'hours');

  // Check if the difference is greater than or equal to 24
  return hoursDifference >= 24;
}