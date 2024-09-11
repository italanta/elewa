import { FormBuilder } from "@angular/forms";

import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "@app/model/convs-mgr/stories/flows";

import { _CreateFlowTextForm } from "./flow-forms/flow-text-form-build.model";

export function _GetFlowComponentForm(_fb: FormBuilder, componentData: FlowPageLayoutElementV31)
{
  if (!componentData) {
    return _CreateFlowTextForm(_fb); // Calls the form creation without data
  }
  switch (componentData.type) 
  {
    case FlowPageLayoutElementTypesV31.TEXT:
      return _CreateFlowTextForm(_fb, componentData);

    // case StoryBlockTypes.CMI5Block:
    //   return _CreateCmi5BlockForm(_fb, block);
  }
  // Default return null
  return undefined;
}