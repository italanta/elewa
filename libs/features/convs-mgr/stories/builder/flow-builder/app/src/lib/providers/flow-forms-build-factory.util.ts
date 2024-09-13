import { FormBuilder } from "@angular/forms";

import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "@app/model/convs-mgr/stories/flows";

import { _CreateFlowTextForm } from "./flow-forms/flow-text-form-build.model";
import { _CreateFlowTextAreaInputForm } from './flow-forms/flow-text-area-form-build.model'
import { _CreateFlowDatePickerInputForm} from './flow-forms/flow-date-input-build.model'
// import { _CreateFlowTextInputForm } from './flow-forms/flow-text-input-form-build.model'

export function _GetFlowComponentForm(_fb: FormBuilder, componentData?: FlowPageLayoutElementV31)
{
  if(componentData){
    switch (componentData.type) 
  {
    case FlowPageLayoutElementTypesV31.TEXT:
      return  _CreateFlowTextForm(_fb, componentData)

    // case FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT:
    //   return  _CreateFlowTextAreaInputForm(_fb, componentData)

    // case FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT:
    //   return  _CreateFlowDatePickerInputForm(_fb, componentData)

    // case FlowPageLayoutElementTypesV31.TEXT_INPUT:
    //   return  _CreateFlowTextInputForm(_fb, componentData)
  }
  }
  // Default return null
  return undefined;
}
