import { Component } from '@angular/core';
import { NewStoryService } from '../../services/new-story.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'italanta-apps-create-module-modal',
  templateUrl: './create-module-modal.component.html',
  styleUrls: ['./create-module-modal.component.scss'],
})
export class CreateModuleModalComponent {
  moduleForm: FormGroup;
  modalMode = false;

  constructor(
    private _addStory$: NewStoryService,
    private _formBuilder: FormBuilder
  ) {}

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
