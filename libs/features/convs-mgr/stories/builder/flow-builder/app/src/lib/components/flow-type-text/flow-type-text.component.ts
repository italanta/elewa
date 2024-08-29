import { Component, EventEmitter, inject, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs/operators';

import { FlowPageLayoutElementTypesV31, FlowPageTextV31 } from '@app/model/convs-mgr/stories/flows';
import { ChangeTrackerService, FlowEditorStateProvider } from '@app/state/convs-mgr/wflows';

import { FlowControl, FlowControlType } from '../../providers/flow-controls.const';
import { TextElementFormService } from '../../services/text-elements-form.service';
import { FeTextElement } from '../../models/fe-flow-text-element.model';

@Component({
  selector: 'lib-flow-header-text',
  templateUrl: './flow-type-text.component.html',
  styleUrls: ['./flow-type-text.component.scss'],
})
export class FlowTypeTextComponent implements OnInit {
  /** The type of input, for text inputs */
  type: FlowControlType;
  flowControlType = FlowControlType;

  /** Control being interacted with */
  control: FlowControl;
  @Output() changeEvent = new EventEmitter<any>();

  inputId = '';
  vrc = inject(ViewContainerRef)

  textInputForm: FormGroup;
  textElement: FlowPageTextV31
  private _sbS = new SubSink();

  constructor(
    private trackerService: ChangeTrackerService,
    private flowStateProvider: FlowEditorStateProvider,
    private textFormService: TextElementFormService
  ) {}

  ngOnInit(): void {
    this.inputId = `input-${this.control.type}`;
    this.buildForm();

    // Subscribe to form value changes
    this._sbS.sink = this.textInputForm.valueChanges
    .pipe(debounceTime(2000))  // 2000 milliseconds = 2 seconds
    .subscribe(formValues => {

      this.buildV31Element();
      
      // Update component state
      this.flowStateProvider.updateComponent({
        group: this.control.group,
        label: this.control.label,
        icon: this.control.icon,
        id: this.control.id,
        type: FlowControlType.Text, 
        value: formValues.text
      });
    });
  }

  buildForm(): void {
    if (this.control && this.textElement) {
      this.textInputForm = this.textFormService.createTextForm(this.textElement);
    } else {
      this.textInputForm = this.textFormService.createEmptyForm();
    }
  }

  buildV31Element() {
    const formValues = {text: this.textInputForm.get('text')?.value,
      size: this.control.type,
      type: FlowPageLayoutElementTypesV31.TEXT,
    } as FeTextElement;

    const textElement = this.textFormService.transformElement(formValues);

    this.trackerService.updateValue(this.control.id, textElement);

    console.log('V31 Element', textElement);
  }
}

