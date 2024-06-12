import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bot } from '@app/model/convs-mgr/bots';

import { FallBackActionTypes, Fallback } from '@app/model/convs-mgr/fallbacks';
import { FallbackModalComponent } from '../../modals/fallback-modal/fallback-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit {
  @Input() fallbacks: Fallback[];
  @Input() bot: Bot;

  // dummyData: Fallback[] = [
  //   {
  //     userInput: ["Hello", "Hi", "How are you?"],
  //     actionsType: FallBackActionTypes.NextBlock,
  //     actionDetails: { description: "Greet the user with a welcome message." },
  //     active: true,
  //     orgId: "12345",
  //     botId: "abc123",
  //   },
  //   {
  //     userInput: ["Can you help me?", "What can you do?"],
  //     actionsType: FallBackActionTypes.Route,
  //     actionDetails: { description: "Display a list of available actions." },
  //     active: true,
  //     orgId: "12345",
  //     botId: "abc123",
  //   },
  //   {
  //     userInput: ["Anything else?", "Goodbye", "See you later"],
  //     actionsType: FallBackActionTypes.Restart,
  //     actionDetails: { description: "Thank the user and end the conversation." },
  //     active: true,
  //     orgId: "12345",
  //     botId: "abc123",
  //   },
  //   {
  //     userInput: ["I don't understand", "Can you rephrase that?"],
  //     actionsType: FallBackActionTypes.ResendLastMessage,
  //     actionDetails: { description: "Prompt the user to rephrase their question." },
  //     active: true,
  //     orgId: "12345",
  //     botId: "abc123",
  //   },
  // ]

  displayedColumns = ['userSays', 'action', 'actionDetails', 'actionButtons']
  dataSource: MatTableDataSource<Fallback>;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Fallback>(this.fallbacks);
  }

  openModal(i: number) {
    const selectedFallBack = this.fallbacks[i];
    this.dialog.open(FallbackModalComponent, {
      panelClass: "fallback-modal-class",
      data: {fallback: selectedFallBack, bot: this.bot}
    });
  }
}
