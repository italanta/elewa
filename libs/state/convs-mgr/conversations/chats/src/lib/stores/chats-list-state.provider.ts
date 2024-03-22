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

  getChatListState()
  {
    return new ChatsListState(
                this._chats$$,
                10) 
    
  }
}