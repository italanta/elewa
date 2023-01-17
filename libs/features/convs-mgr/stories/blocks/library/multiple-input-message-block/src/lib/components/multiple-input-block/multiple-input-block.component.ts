import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { MultipleInputMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

@Component({
  selector: 'app-multiple-input-block',
  templateUrl: './multiple-input-block.component.html',
  styleUrls: ['./multiple-input-block.component.scss'],
})
export class MultipleInputBlockComponent<T> implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() block: MultipleInputMessageBlock;
  @Input() multipleInputMessageBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.block.options) {
      this.autoFillOptionsData();
    }
  }

  autoFillOptionsData() {
    this.block.options?.forEach((options, index: number) => {
      this.options.push(this._fb.group({ values: this._fb.array([]) }));
      let arrGrp = this.options.at(index) as FormGroup;
      let grpArray = arrGrp.get('values') as FormArray;

      options.values.forEach((value: string) => {
        grpArray.push(new FormControl(value))
      })
    })
  }

  get options(): FormArray {
    return this.multipleInputMessageBlock.controls['options'] as FormArray;
  }

  getGroupControls(index: number) {
    let grp = this.options.at(index) as FormGroup;
    let grpArray = grp.get('values') as FormArray;

    return grpArray;
  }

  addQuestionOptions() {
    return new FormControl();
  }

  addNewOption(index: number) {
    let grp = this.options.at(index) as FormGroup;
    let grpArray = grp.get('values') as FormArray;
    grpArray.push(this.addQuestionOptions())
  }

  addNewOptionGroup() {
    this.options.push(this.addNewOptionFormGroup());
  }

  addNewOptionFormGroup(): FormGroup {
    return this._fb.group({
      values: this._fb.array([new FormControl('')])
    })
  }
}



