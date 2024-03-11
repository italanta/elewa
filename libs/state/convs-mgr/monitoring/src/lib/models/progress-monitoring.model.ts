import * as moment from 'moment';
import { flatten as ___flatten, clone as ___clone } from 'lodash';

import { BehaviorSubject, combineLatest, map, Observable, of, tap } from "rxjs";

import { __DateFromStorage } from '@iote/time';

import { GroupProgressModel, Periodicals } from '@app/model/analytics/group-based/progress';

import { ProgressMonitoringStore } from '../stores/progress-monitoring.store';


/** Number of pages to load per backend call. */
const PAGES_TO_LOAD_PER_CALL = 2;

/**
 * State holder for the @see {ChatsListComponent}. 
 *  Smartly paginates the loaded data.
 */
export class ProgressMonitoringState 
{
  /** State of the current page we're navigating. */
  private _page$$: BehaviorSubject<number> = new BehaviorSubject(-1);

  private _period$$: BehaviorSubject<Periodicals> = new BehaviorSubject("Weekly" as Periodicals);

  private _filter$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private allPages$: BehaviorSubject<number> = new BehaviorSubject(0);
  private isFirst$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isLast$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  dateRange: {start: Date, end: Date};

  customSelectedDate: {start: moment.Moment, end: moment.Moment};
  isCustom = false;

  private _daysToLoad = 7;

  private _weeksToLoad = 8;

  private _monthsToLoad = 12;

  /** Current page on which the user is viewing */
  private _pageCursor: number;
  /** Amount of pages we've loaded */
  private _pages = 0;

  constructor(
    private _progressStore$$: ProgressMonitoringStore,
  )
  {
    // Perform initialLoad
    this._pageCursor = 0;
  }

  /** Returns chats scoped to the current page the user is viewing. */
  public getProgress(): Observable<{scopedProgress: GroupProgressModel[], allProgress: GroupProgressModel[]}>
  {
    const progressAfterInit$ = this._progressStore$$.get();

    return combineLatest([progressAfterInit$, this._page$$, this._period$$]).pipe(
      map(([progress, page, period]) =>
      {
        const filteredProgress = this._applyFilter(progress, period);

        const pageCount = this._calculatePageCount(filteredProgress.length, period);

        if(page === -1) {
          // Start with the last page
          page = pageCount;

          // Update the page cursor to the last page
          this._pageCursor = pageCount;
        }

        this._setIsFirst(page);

        this._setIsLast(page, pageCount);

        this.allPages$.next(pageCount);
        return {
          scopedProgress: this._scopeProgress(filteredProgress, page, period),
          allProgress: progress
        }
      })
    );
  }

  private _setIsFirst(page: number) {
    if(page == 1) {
      this.isFirst$.next(true);          
    } else {
      this.isFirst$.next(false);
    }
  }

  isFirst() {
    return this.isFirst$.asObservable();
  }

  isLast() {
    return this.isLast$.asObservable();
  }

  private _setIsLast(page: number, allPages: number) {
    if(page == allPages) {
      this.isLast$.next(true);          
    } else {
      this.isLast$.next(false);
    }

    if(this.isCustom) {
      this.isLast$.next(false);
    }
  }

  private _calculatePageCount(progress: number, period: Periodicals): number
  {
    const itemsPerPage = this._getItemsPerPage(period);

    let pagesCount = progress / itemsPerPage;

    if (progress % itemsPerPage !== 0) {
      pagesCount = Math.floor(pagesCount) + 1;
    }

    return pagesCount;
  }

  private _getItemsPerPage(period: Periodicals) {
    switch (period) {
      case "Daily":
        return this._daysToLoad;
      case "Weekly":
        return this._weeksToLoad;
      case "Monthly":
        return this._monthsToLoad;
      default:
        return this._weeksToLoad;
    }
  }

  /** Returns filtered chats */
  private _applyFilter(progress: GroupProgressModel[], period: Periodicals)
  {
    if(this.isCustom) {
      progress = this._filterByDateRange(progress);
    }
    if (period == "Weekly") {
      return this.getWeeklyProgress(progress);
    } else if(period == "Monthly") {
      return this.getMonthlyProgress(progress);
    }

    return progress;
  }

  //
  // REGION - NAVIGATE DATA STRUCTURE
  //

  /** 
   * Side effect that navigates the data to the next page. 
   *    Will update the viewmodel observable source on navigate.
   * 
   * @param direction - 'past'   -> Navigate a page back
   *                  - 'future' -> Navigate a page forward
  */
  public nextPage(direction: 'past' | 'future')
  {
    return direction === 'past'
      ? this._loadPastPage()
      : this._loadNextPage();
  }

  public filterChats(filter: string)
  {
    this._filter$$.next(filter);
  }

  /** Load the previous page */
  private async _loadPastPage()
  {
    // Case 1. We already loaded the page
    if (this._pageCursor > 0) {
      this._pageCursor--;
      this._page$$.next(this._pageCursor);
    }
    // Case 2. We are loading a new history
    else {

      // Trigger a viewmodel update. Since we add n (=PAGES_TO_LOAD_PER_CALL) pages before the
      //  previously last boundary, we need to move the cursor to the previous page which is at location
      //  PAGES_TO_LOAD_PER_CALL - 1.
      this._pageCursor = PAGES_TO_LOAD_PER_CALL - 1;

      this._page$$.next(this._pageCursor);
    }
  }

  /** Load the next page */
  private async _loadNextPage()
  {
    // Case 1. We already loaded the page
    if (this._pageCursor + 1 < this._pages) {
      this._pageCursor++;
      this._page$$.next(this._pageCursor);
    }
    // Case 2. We are loading a new future page 
    else {

      // Navigate to the next page by triggering a cursor update. 
      //  Since the viewmodel has changed as well, the trigger will be able to get the data
      //    from the new viewmodel
      this._pageCursor++;
      this._page$$.next(this._pageCursor);
    }
  }
  //
  // SECTION - SCOPE CHATS TO CURRENT PAGE
  //

  private _scopeProgress(progress: GroupProgressModel[], page: number, period: Periodicals)
  {
    let loadsPerPage = this._daysToLoad;

    const totalItems = progress.length;

    if (period == "Weekly") {
      loadsPerPage = this._weeksToLoad;
    } else if(period == "Monthly") {
      loadsPerPage = this._monthsToLoad;
    }

    let scopedProgress = ___clone(progress);

    const sliceTo = Math.min(totalItems, page * loadsPerPage);
    const sliceFrom = loadsPerPage > sliceTo ? 0 : (sliceTo - loadsPerPage);

    scopedProgress = scopedProgress.slice(sliceFrom, sliceTo);

    if(scopedProgress.length < 1) return [];
    
    this.dateRange = {
      start: scopedProgress[0].createdOn as Date,
      end: scopedProgress[scopedProgress.length -1].createdOn as Date
    }

    return scopedProgress;
  }

  private _filterByDateRange(progress: GroupProgressModel[]): GroupProgressModel[] {
    return progress.filter((item) =>{
      const momentDate = __DateFromStorage(item.createdOn as Date);
      const endDate = this.customSelectedDate.end.clone().add(1, 'days');

      return momentDate.isBetween(this.customSelectedDate.start, endDate, undefined, '[]')
    })
  }

  /**
   * Navigates to specific page
   * 
   * @param page - Page number to navigate to
   */
  goToPage(page: number)
  {
    this._pageCursor = page;
    this._page$$.next(this._pageCursor);
  }

  /** 
   * Resets the page number
   * 
   * Each period has different page numbers, so we reset the page
   *  number so that the user can start from the current date data
   */
  resetPage() {
    this._page$$.next(-1);
  }

  /** Returns the current page */
  getPage()
  {
    return this._page$$;
  }

  setPeriod(period: Periodicals) {
    this._period$$.next(period);
  }

  getPeriod() {
    return this._period$$.asObservable();
  }

  /** Retrieves weekly milestones of all users */
  getWeeklyProgress(allProgress: GroupProgressModel[])
  {
    return allProgress.filter((model) =>
    {
      const timeInDate = new Date(model.time);
      const dayOfWeek = timeInDate.getDay();

      if (dayOfWeek === 5) return true; // if friday
      else return false;
    });
  }

  getAnalyticsStartDate() {
    return this._progressStore$$.get().pipe(map((progress: GroupProgressModel[])=> {

      const date = (progress.reduce((prev, current) => {
        return ((prev.createdOn as Date) < (current.createdOn as Date)) ? prev : current
      })).createdOn as Date;

      return __DateFromStorage(date);
    }))
  }

  /** Retrieves monthly milestones of all users */
  getMonthlyProgress(allProgress: GroupProgressModel[]) {
  return allProgress.filter((model) => {
    const timeInDate = new Date(model.time); // 0 = Sunday, 1 = Monday, ...
    const isLastDayOfMonth = new Date(timeInDate.getFullYear(), timeInDate.getMonth() + 1, 0).getDate() === timeInDate.getDate();

    if (isLastDayOfMonth) return true;
    else return false;
  });
}

}