import { Component } from '@angular/core';
import { NewStoryService } from '../../services/new-story.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'italanta-apps-create-lesson-modal',
  templateUrl: './create-lesson-modal.component.html',
  styleUrls: ['./create-lesson-modal.component.scss'],
})
export class CreateLessonModalComponent {
  lessonForm: FormGroup;
  modalMode = false;

  constructor(
    private _addStory$: NewStoryService,
    private _formBuilder: FormBuilder
  ) {}

  createFormGroup() {
    this.lessonForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: [''],
      module: ['', Validators.required],
    });
  }

  submitForm() {
    console.log(this.lessonForm.value);
    //
  }
}
