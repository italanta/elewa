import { AfterViewInit, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { ConditionalBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { ProcessInputService } from '@app/features/convs-mgr/stories/blocks/process-inputs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conditional-block',
  templateUrl: './conditional-block.component.html',
  styleUrls: ['./conditional-block.component.scss'],
})
export class ConditionalBlockComponent<T> implements AfterViewInit {
  
  @Input() id: string;
  @Input() block: ConditionalBlock;
  @Input() conditionalBlockForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  vars$: Observable<string[]>;

  readonly listOptionInputLimit = 20;
  readonly listOptionsArrayLimit = 10

  constructor(private _fb: FormBuilder, private variables:ProcessInputService) {
    this.vars$ = this.variables.getAllVariables()
  }

  ngAfterViewInit(): void {
    this.block.options?.forEach((item) => {
      this.options.push(this.addExistingOptions(item));
    })
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
    if (this.options.length < this.listOptionsArrayLimit) this.options.push(this.addExistingOptions());
  }

  deleteInput(i: number) {
    this.options.removeAt(i);
  }
}
