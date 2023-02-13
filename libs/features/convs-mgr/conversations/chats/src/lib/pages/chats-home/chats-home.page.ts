import { Component } from '@angular/core';
import { Chat } from '@elewa/model/conversations/chats';


@Component({
  selector: 'app-chats-home-page',
  templateUrl: './chats-home.page.html',
  styleUrls:  ['./chats-home.page.scss']
})
export class ChatsHomePage
{
  isLoading = true;
  filter = "learning";
  filterMode = false;
  selected = "Learning";
  currentChat: Chat;

  constructor()
  {}
}
