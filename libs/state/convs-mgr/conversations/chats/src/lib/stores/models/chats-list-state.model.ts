import { flatten as ___flatten, clone as ___clone } from 'lodash';

import { BehaviorSubject, combineLatest, map, tap, Observable } from "rxjs";

import { Chat } from "@app/model/convs-mgr/conversations/chats";

import { ChatsStore } from "../chats.store";

/** Number of pages to load per backend call. */
const PAGES_TO_LOAD_PER_CALL = 2;

/**
 * State holder for the @see {ChatsListComponent}. 
 *  Smartly paginates the loaded data.
 */
export class ChatsListState 
{
  /** State of the current page we're navigating. */
  private _page$$: BehaviorSubject<number> = new BehaviorSubject(0);

  private _filter$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /** Current page on which the user is viewing */
  private _pageCursor: number;
  /** Amount of pages we've loaded */
  private _pages = 0;

  private allPages$: BehaviorSubject<number> = new BehaviorSubject(0);;

  constructor(
    private _chats$$: ChatsStore,
    /** Number of days to load per page */
    private _loadsPerPage: number = 10,
  )
  {

    // Perform initialLoad
    this._pageCursor = 0;
  }

  /** Returns chats scoped to the current page the user is viewing. */
  public getChats(): Observable<Chat[]>
  {
    const chatsAfterInit$ = this._chats$$.get();

    return combineLatest([chatsAfterInit$, this._page$$, this._filter$$]).pipe(
      tap(([chats]) =>
      {
        const pageCount = this._calculatePageCount(this._applyFilter(chats).length, this._loadsPerPage);
        this.allPages$.next(pageCount);
      }),
      map(([chats, page, filter]) =>
      {
        const filteredChats = this._applyFilter(chats);
        return this._scopeChatsPage(filteredChats, page);
      })
    );
  }

  /** Returns filtered chats */
  private _applyFilter(chats: Chat[])
  {
    const filterValue = this._filter$$.getValue();

    if (filterValue == 'blocked') {
      return this._filterHelpRequests(chats);
    }

    return chats;
  }

  private _filterHelpRequests(chats: Chat[])
  {
    return chats.filter((chats) => chats.isConversationComplete == -1);
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

  private _scopeChatsPage(chats: Chat[], page: number)
  {


    let scopedChatsList = ___clone(chats);

    const sliceFrom = page * this._loadsPerPage;
    scopedChatsList = scopedChatsList.slice(sliceFrom, sliceFrom + this._loadsPerPage);

    return scopedChatsList;
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

  /** Returns the total number of pages */
  getPageCount()
  {
    return this.allPages$;
  }

  private _calculatePageCount(chats: number, itemsPerPage: number): number
  {
    let pagesCount = chats / itemsPerPage;

    if (chats % itemsPerPage !== 0) {
      pagesCount = Math.floor(pagesCount) + 1;
    }

    return pagesCount;
  }

}