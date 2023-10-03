import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryStateService } from '@app/state/convs-mgr/stories';

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

@Component({
  selector: 'italanta-apps-create-lesson-modal',
  templateUrl: './create-lesson-modal.component.html',
  styleUrls: ['./create-lesson-modal.component.scss'],
})
export class CreateLessonModalComponent implements OnInit {
  lessonForm: FormGroup;
  modalMode = false;

  story: Story;
  isSavingStory = false;

  constructor(
    private _stateStoryServ$: StoryStateService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit () {
    this.createFormGroup();
  }

  generateName() {
    const defaultName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    return defaultName;
  }

  createFormGroup() {
    this.lessonForm = this._formBuilder.group({
      botName: [this.generateName()],
      botDesc: [''],
      module: ['', Validators.required],
    });
  }

  add() {
    const newStory: Story = {
      name: this.lessonForm.value.botName,
      description: this.lessonForm.value.botDesc,
      orgId: '',
    };

    this._stateStoryServ$.createStory(newStory).subscribe(() => {
      // send output event to move to next step
    });
  }

  update() {
    this.story.name = this.lessonForm.value.botName;
    this.story.description = this.lessonForm.value.botDesc;

    this._stateStoryServ$.updateStory(this.story).subscribe(() => {
      // send output event to close dialog
    });
  }

  submitForm() {
    this.isSavingStory = true;
    this.modalMode ? this.update() : this.add();
  }
}
