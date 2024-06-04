import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { FallBackActionTypes, Fallback } from '@app/model/convs-mgr/fallbacks';
import { FallbackService } from '@app/state/convs-mgr/fallback';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit {
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

  constructor(private _fallBackService: FallbackService) {}

  ngOnInit(): void {
    this._fallBackService.getAllFallbacks().subscribe((data: Fallback[]) => {
      this.dataSource = new MatTableDataSource<Fallback>(data.length > 0? data : this.dummyData);
    });
  }
}
