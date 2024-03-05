import * as moment from "moment";

import { Periodicals } from "@app/model/analytics/group-based/progress";

export function getDateRange(period: Periodicals | null) {
  const range = {start: "", end: ""};

  switch (period) {
    case 'Daily':
      range.end = moment().format('ddd DD/MM');
      range.start = moment().subtract(7,'d').format('ddd DD/MM')
      return range;

    case 'Weekly':
      range.end = moment().format('DD/MM/YY');
      range.start = moment().subtract(8,'w').format('DD/MM/YY');
      return range;

    case 'Monthly':
      range.end = moment().format('MMMM YYYY');
      range.start = moment().subtract(12,'M').format('MMMM YYYY');
      return range;
    default:
      // Return Weekly range
      range.end = moment().format('DD/MM/YY');
      range.start = moment().subtract(8,'w').format('DD/MM/YY');
      return range;
  }
}