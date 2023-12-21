import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ChatsListState } from "./models/chats-list-state.model";
import { ChatsStore } from "./chats.store";


@Injectable({
  providedIn: 'root'
})
export class ChatsListStateProvider
{
  constructor(private _http: HttpClient, private _chats$$: ChatsStore) 
  { }

  /**
   * Function that initialises the state for a booking calendar
   * 
   * @param hotelId - Hotel ID to render
   * @returns {BookingCalendarState} - A flexible state holder for the booking calendar
   */
  getChatListState()
  {
    return new ChatsListState(
                this._chats$$, // Show the start of the current week as the first day
                10)                        // Show weekly views
    
  }
}