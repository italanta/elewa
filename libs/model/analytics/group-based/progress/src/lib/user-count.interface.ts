export interface UserCount {
  /** Daily user count */
  dailyCount: number;

  /** Weekly user count */
  pastWeekCount: number;

  /** Monthly user count */
  pastMonthCount: number;

  /** Current Week user count */
  currentWeekCount?: number;

  /** Current Month user count */
  currentMonthCount?: number;
}