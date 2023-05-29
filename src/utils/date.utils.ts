import moment from "moment";



export const hoursPast = (date: string | Date) => {
  const momentA = moment(new Date());
  const momentB = moment(date);
  const momentDiff = momentB.diff(momentA);
  const hoursPastAmount = Math.abs(moment.duration(momentDiff).asHours());
  return hoursPastAmount;
}