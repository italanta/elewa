import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";

import { ElementsOptions, FEFlowOptionGroup } from "../models/fe-flow-option-element.model";


@Injectable({providedIn: 'root'})

export class OptionGroupFormService 
{
  constructor (private _formBuilder: FormBuilder){}

  createSingleOptionForm(flowControl: ElementsOptions)
  {
    return this._formBuilder.group({
      optionId: [flowControl.optionId ?? ''],
      label: [flowControl.label ?? '']
    })
  }

  createRadioGroupForm(flowGroup?: FEFlowOptionGroup)
  {
    if(flowGroup){
      return this._formBuilder.group({
        name: [flowGroup.name || ''],
        label: [flowGroup.label || ''],
        required: [flowGroup.required || false],
        options: this._formBuilder.array(
          (flowGroup.options || []).map(option => this.createSingleOptionForm(option))
        )
       })
      }else{
        return this.createEmptyRadioGpForm()
      }
    }
  
  createEmptyRadioGpForm()
  {
    return this._formBuilder.group({
      name: [''],
      label: [''],
      required: [''],
      options: this._formBuilder.array([])
    })
  }
}