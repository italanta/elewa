import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'italanta-apps-create-module-modal',
  templateUrl: './create-module-modal.component.html',
  styleUrls: ['./create-module-modal.component.scss'],
})
export class CreateModuleModalComponent implements OnInit {
  moduleForm: FormGroup;
  modalMode = false;

  constructor(
    private _botModulesServ: BotModulesStateService,
    private _addStory$: NewStoryService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit () {
    this.createFormGroup();
  }

  createFormGroup() {
    this.moduleForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: [''],
      module: ['', Validators.required],
    });
  }

  submitForm() {
    console.log(this.moduleForm.value);
    //
  }
}
