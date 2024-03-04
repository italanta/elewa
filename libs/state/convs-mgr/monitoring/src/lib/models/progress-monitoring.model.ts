import { flatten as ___flatten, clone as ___clone } from 'lodash';

import { BehaviorSubject, combineLatest, map, tap, Observable } from "rxjs";

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
  private _page$$: BehaviorSubject<number> = new BehaviorSubject(0);

  private _period$$: BehaviorSubject<Periodicals> = new BehaviorSubject("Weekly" as Periodicals);

  private _filter$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
  public getProgress(): Observable<GroupProgressModel[]>
  {
    const progressAfterInit$ = this._progressStore$$.get();

    return combineLatest([progressAfterInit$, this._page$$, this._period$$]).pipe(
      map(([progress, page, period]) =>
      {
        const filteredProgress = this._applyFilter(progress, period);
        return this._scopeProgress(filteredProgress, page, period);
      })
    );
  }

  /** Returns filtered chats */
  private _applyFilter(progress: GroupProgressModel[], period: Periodicals)
  {
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
    // const period = this._period$$.getValue();

    const totalItems = progress.length;

    if (period == "Weekly") {
      loadsPerPage = this._weeksToLoad;
    } else if(period == "Monthly") {
      loadsPerPage = this._monthsToLoad;
    }

    let scopedProgress = ___clone(progress);

    // const sliceFrom = page * loadsPerPage;

    const sliceFrom = Math.max(0, totalItems - (page + 1) * loadsPerPage);

    scopedProgress = scopedProgress.slice(sliceFrom, sliceFrom + loadsPerPage);

    return scopedProgress;
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