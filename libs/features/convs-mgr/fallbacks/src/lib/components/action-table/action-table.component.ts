import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bot } from '@app/model/convs-mgr/bots';

import { FallBackActionTypes, Fallback } from '@app/model/convs-mgr/fallbacks';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit {
  @Input() fallbacks: Fallback[];
  @Input() bot: Bot;

  dummyData: Fallback[] = [
    {
      userInput: ["Hello", "Hi", "How are you?"],
      actionsType: FallBackActionTypes.NextBlock,
      actionDetails: { description: "Greet the user with a welcome message." },
      active: true,
      orgId: "12345",
      botId: "abc123",
    },
    {
      userInput: ["Can you help me?", "What can you do?"],
      actionsType: FallBackActionTypes.Route,
      actionDetails: { description: "Display a list of available actions." },
      active: true,
      orgId: "12345",
      botId: "abc123",
    },
    {
      userInput: ["Anything else?", "Goodbye", "See you later"],
      actionsType: FallBackActionTypes.Restart,
      actionDetails: { description: "Thank the user and end the conversation." },
      active: true,
      orgId: "12345",
      botId: "abc123",
    },
    {
      userInput: ["I don't understand", "Can you rephrase that?"],
      actionsType: FallBackActionTypes.ResendLastMessage,
      actionDetails: { description: "Prompt the user to rephrase their question." },
      active: true,
      orgId: "12345",
      botId: "abc123",
    },
  ]

  displayedColumns = ['userSays', 'action', 'actionDetails', 'actionButtons']
  dataSource: MatTableDataSource<Fallback>;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Fallback>(this.fallbacks);
  }
}
