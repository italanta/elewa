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

  viewRoles: string[] = [];

  panelState: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.roles)
      this.viewRoles = this.roles.map((role) => role.replace(/([a-z])([A-Z])/g, '$1 $2'));
  }
}
