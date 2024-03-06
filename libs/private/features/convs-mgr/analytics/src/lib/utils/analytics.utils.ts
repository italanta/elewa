import * as moment from "moment";

import { __DateFromStorage } from "@iote/time";

import { Periodicals } from "@app/model/analytics/group-based/progress";

export function getDateRange(period: Periodicals | null, dateRange: {start: Date, end: Date}) {

  const startDate = __DateFromStorage(dateRange.start);
  const endDate = __DateFromStorage(dateRange.end);

  const now = moment();
  
  const range = {start: "", end: ""};

  switch (period) {
    case 'Daily':
      range.end = endDate.format('ddd DD/MM');
      range.start = startDate.format('ddd DD/MM')
      return range;

    case 'Weekly':
      range.end = endDate.format('DD/MM/YY');
      range.start = startDate.format('DD/MM/YY');
      return range;

    case 'Monthly':
      range.end = endDate.format('MMMM YYYY');
      range.start = startDate.format('MMMM YYYY');
      return range;
    default:
      // Return Weekly range
      range.end = endDate.format('DD/MM/YY');
      range.start = startDate.format('DD/MM/YY');
      return range;
  }
}
