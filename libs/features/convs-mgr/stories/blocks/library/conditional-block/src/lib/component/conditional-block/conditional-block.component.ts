import { AfterViewInit, Component, Input, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';
import { Observable, map, startWith } from 'rxjs';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ConditionalBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { VariablesService } from '@app/features/convs-mgr/stories/blocks/process-inputs';

import { OptionInputFieldComponent } from '../../../../../block-options/src/lib/components/option-input-field/option-input-field.component';
import { CursorFocusService } from '../../../../../main/src/lib/providers/cursor-focus.service';

@Component({
  selector: 'app-conditional-block',
  templateUrl: './conditional-block.component.html',
  styleUrls: ['./conditional-block.component.scss'],
})
export class ConditionalBlockComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string;
  @Input() block: ConditionalBlock;
  @Input() conditionalBlockForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @ViewChildren('optionInputFields') optionInputFields: QueryList<OptionInputFieldComponent>;

  private currentIndex = 0; 

  vars$: Observable<string[]>;

  private _sBs = new SubSink();
  readonly listOptionInputLimit = 20;
  readonly listOptionsArrayLimit = 10;

  constructor(private _fb: FormBuilder, private variables: VariablesService, private cursorFocusService: CursorFocusService) {
    this.vars$ = this.variables.getAllVariables();
  }

  ngOnInit() {
    this.manageFormControls()
  }

  ngAfterViewInit(): void {
    this.block.options?.forEach((item) => {
      this.options.push(this.addExistingOptions(item));
    });
  }

  manageFormControls() {
    this._sBs.sink = this.isTyped.valueChanges.pipe(startWith(this.isTyped.value),map(isTyped => {
      if (isTyped) {
        this.selectedVar.reset()
        this.selectedVar.disable()
        this.typedVar.enable()
      }
      else {
        this.typedVar.reset()
        this.typedVar.disable()
        this.selectedVar.enable()
      }
    })).subscribe()
  }

  get isTyped(): AbstractControl {
    return this.conditionalBlockForm.controls['isTyped']
  }

  get selectedVar(): AbstractControl {
    return this.conditionalBlockForm.controls['selectedVar']
  }

  get typedVar(): AbstractControl {
    return this.conditionalBlockForm.controls['typedVar']
  }

  get options(): FormArray {
    return this.conditionalBlockForm.controls['options'] as FormArray;
  }

  addExistingOptions(optionItem?: ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [optionItem?.id ?? `${this.id}-${this.options.length + 1}`],
      message: [optionItem?.message ?? ''],
      value: [optionItem?.value ?? '']
    })
  }

  addNewOption() {
    if (this.options.length < this.listOptionsArrayLimit) {
      this.options.push(this.addExistingOptions());
    }
    setTimeout(() => {
      this.setFocusOnNextInput();
    });
  }

  deleteInput(i: number) {
    this.options.removeAt(i);
  }

  setFocusOnNextInput() {
    this.currentIndex = this.cursorFocusService.focusOnNextInput(
      this.currentIndex,
      this.optionInputFields
    );
  }

  ngOnDestroy() {
    this._sBs.unsubscribe()
  }
}
