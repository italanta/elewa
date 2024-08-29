import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";

import { FEFlowRadioGroup, RadioOptions } from "../models/fe-flow-radio-element.model";


@Injectable({providedIn: 'root'})

export class RadioOptionGroupFormService 
{
  constructor (private _formBuilder: FormBuilder){}

  createSingleOptionForm(flowControl: RadioOptions)
  {
    return this._formBuilder.group({
      optionId: [flowControl.optionId ?? ''],
      label: [flowControl.label ?? '']
    })
  }

  createRadioGroupForm(flowGroup: FEFlowRadioGroup)
  {
    return this._formBuilder.group({
      name: [flowGroup.name || ''],
      label: [flowGroup.label || ''],
      required: [flowGroup.required || false],
      options: this._formBuilder.array(
        (flowGroup.options || []).map(option => this.createSingleOptionForm(option))
      )
    })
  }

  createEmptyRadioGpForm()
  {
    return this._formBuilder.group({
      name: [''],
      label: [''],
      required: [''],
      options: this._formBuilder.array(
        ([])
      )
    })
  }
}