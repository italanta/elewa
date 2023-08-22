import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'clm-chats-settings',
  templateUrl: './chats-settings.component.html',
  styleUrls: ['./chats-settings.component.scss']
})
export class ChatsSettingsComponent implements OnInit {

  @Input() chatsSettingsFormGroup: FormGroup;
  @Input() roles: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
