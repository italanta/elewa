import * as moment from "moment";

import { __DateFromStorage } from "@iote/time";

import { Periodicals } from "@app/model/analytics/group-based/progress";

export function getDateRange(period: Periodicals | null) {
  const now = moment();
  
  const range = {start: "", end: ""};

  switch (period) {
    case 'Daily':
      range.end = now.format('ddd DD/MM');
      range.start = now.subtract(7,'d').format('ddd DD/MM')
      return range;

    case 'Weekly':
      range.end = now.format('DD/MM/YY');
      range.start = now.subtract(8,'w').format('DD/MM/YY');
      return range;

    case 'Monthly':
      range.end = now.format('MMMM YYYY');
      range.start = now.subtract(12,'M').format('MMMM YYYY');
      return range;
    default:
      // Return Weekly range
      range.end = now.format('DD/MM/YY');
      range.start = now.subtract(8,'w').format('DD/MM/YY');
      return range;
  }
}
