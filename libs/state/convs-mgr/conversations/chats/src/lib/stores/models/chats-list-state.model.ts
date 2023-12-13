import { flatten as ___flatten, clone as ___clone } from 'lodash';

import { BehaviorSubject, combineLatest, filter, map } from "rxjs";

import { Chat } from "@app/model/convs-mgr/conversations/chats";

import { ChatsStore } from "../chats.store";

/** Number of pages to load per backend call. */
const PAGES_TO_LOAD_PER_CALL = 2;

/**
 * State holder for the @see {CalendarViewModel}. 
 *  For use on the booking calendar component.
 *  Smartly paginates the loaded data.
 */
export class ChatsListState 
{
  // private model!: AvailabilityCalendar;
  // /** State of the availability calendar. */
  // private _calendar$$: BehaviorSubject<AvailabilityCalendar> = new BehaviorSubject(null as any as AvailabilityCalendar);
  /** State of the current page we're navigating. */
  private _page$$: BehaviorSubject<number> = new BehaviorSubject(0);

  /** Current page on which the user is viewing */
  private _pageCursor: number;
  /** Amount of pages we've loaded */
  private _pages = 0;

  constructor(
    private _chats$$: ChatsStore,
    /** Number of days to load per page */
    private _loadsPerPage: number = 10,
    )
  {

    // Perform initialLoad
    this._pageCursor = 0;
  }

  /** Returns the calendar viewmodel
   *    scoped to the current page the user is viewing. */
  public getChats()
  {
    const chatsAfterInit$ = this._chats$$.get()

    return combineLatest
      ([chatsAfterInit$, this._page$$])
      .pipe(
        map(([chats, page]) =>
          this._scopeChatsPage(chats, page)));
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

  /** Load the week before */
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

  /** Load the week after */
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
  // SECTION - SCOPE CALENDAR TO CURRENT PAGE
  //

  private _scopeChatsPage(chats: Chat[], page: number)
  {
    let scopedChatsList = ___clone(chats);

    const sliceFrom = page * this._loadsPerPage;
    scopedChatsList = scopedChatsList.slice(sliceFrom, sliceFrom + this._loadsPerPage);

    return scopedChatsList;
  }
}