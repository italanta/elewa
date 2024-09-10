import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { ChangeTrackerService } from '@app/state/convs-mgr/wflows';
import { ImageInputFormService } from '../../utils/build-image-input-form.service';
import { FlowImage } from '@app/model/convs-mgr/stories/flows';

@Component({
  selector: 'lib-image-type-input',
  templateUrl: './image-type-input.component.html',
  styleUrl: './image-type-input.component.scss',
})
export class ImageTypeInputComponent implements OnInit
{
  /** The type of input, for text inputs */
  type: FlowControlType
  /** Type of control enum */
  flowControlType = FlowControlType;
  /** Specific control */
  control: FlowControl

  /** Dynamic input id */
  inputId = '';
  imageInputForm: FormGroup;

  /** View Container */
  vrc = inject(ViewContainerRef)


  private _sbS = new SubSink ()

  constructor(private trackerService: ChangeTrackerService,
              private _formService: ImageInputFormService
) {}

  ngOnInit(): void {
    this.inputId = `input-${this.type}`;
    this.buildForms()
  }

  buildForms(element?: FlowImage): void {
    this.imageInputForm = element
      ? this._formService.buildImageForm(element)
      : this._formService.buildImageForm();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageInputForm.patchValue({
          src: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

  saveConfigurations()
  {
    if(this.imageInputForm.valid)
    {
      const imageObject = this.imageInputForm.value
      this.triggerAutosave(imageObject)
    }
  }

  /** Trigger autosave */
  private triggerAutosave(newValue: any): void {
    this.trackerService.updateValue(this.control.id, newValue);
  }
}
