import { Component, EventEmitter, inject, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { debounceTime } from 'rxjs/operators';

import { FlowControl, FlowControlType, FlowPageLayoutElementTypesV31, FlowPageTextV31 } from '@app/model/convs-mgr/stories/flows';
import { WhatsappFlowsStore } from '@app/state/convs-mgr/wflows';
import { ChangeTrackerService } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

import { TextElementFormService } from '../../services/text-elements-form.service';
import { EditableTextElement } from '../../models/fe-flow-text-element.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteElementComponent } from '../../modals/confirm-delete-element.component';

@Component({
  selector: 'lib-flow-header-text',
  templateUrl: './flow-type-text.component.html',
  styleUrls: ['./flow-type-text.component.scss'],
})
export class FlowTypeTextComponent implements OnInit {
  @Input() elementForm: FormGroup;

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
    private textFormService: TextElementFormService, 
    private _wFlowStore: WhatsappFlowsStore,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.inputId = `input-${this.control.controlType}`;
    this.textInputForm = this.elementForm;

    // Subscribe to form value changes
    this._sbS.sink = this.textInputForm.get('text')?.valueChanges
      .pipe(debounceTime(1000))  //1 second
      .subscribe(value=> {
      this.buildV31Element(value);
    });
  }

  deleteElement(){
    this._dialog.open(ConfirmDeleteElementComponent)
  }
  buildV31Element(value: string) {
    const formValue = {
      text: value,
      size: this.control.controlType,
      type: FlowPageLayoutElementTypesV31.TEXT,
    } as EditableTextElement;

    const textElement = this.textFormService.transformElement(formValue);

    this.trackerService.updateValue(textElement).subscribe((_res: any) =>{
      console.log(_res)
    });
    
  }
}

