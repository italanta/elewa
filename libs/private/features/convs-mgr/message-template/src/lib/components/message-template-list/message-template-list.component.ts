import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageTemplate } from '@app/private/model/message-template';

@Component({
  selector: 'app-message-template-list',
  templateUrl: './message-template-list.component.html',
  styleUrls: ['./message-template-list.component.scss'],
})
export class MessageTemplateListComponent {

  isSaving: boolean;
  messageTemplateColumns = ['name', 'sentMessages', 'lastUpdated', 'actions'];
  @Input() dataSource: MatTableDataSource<MessageTemplate>;
  // @Input() assessments: MessageTemplate[];
  constructor(private _router: Router) {}
  
  onCreate() {
    throw new Error('Method not implemented.');
  }
  createTemplate() :void{
    this._router.navigate(['/messaging/create'])
  }
}
