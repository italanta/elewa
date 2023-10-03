import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageTemplatesService } from '@app/private/state/message-templates';

@Component({
  selector: 'app-message-template-create',
  templateUrl: './message-template-create.component.html',
  styleUrls: ['./message-template-create.component.scss'],
})
export class MessageTemplateCreateComponent {
  // action: string;
  // constructor(
  //   private _route$$: Router,
  //   private _route:ActivatedRoute,
  //   private _snackBar: MatSnackBar,
  //   private _templateService: MessageTemplatesService,
  // ) {}

  // ngOnInit(): void {
  //     this.action = this._route$$.url.split('/')[2];
  //     if (this.action === 'create') {
  //       this.initializeEmptyAssessmentForm();
  //     } else {
  //       this.initPage();
  //     }
  // }
}
