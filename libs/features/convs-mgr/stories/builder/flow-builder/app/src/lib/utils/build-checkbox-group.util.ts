import { FlowOptionsInputV31, FlowPageLayoutElementTypesV31 } from "@app/model/convs-mgr/stories/flows";
import { FEFlowOptionGroup } from "../models/fe-flow-option-element.model";

/**
 * 
 * @param FeGroup Simple object that holds the options configuraton data
 * @returns A FlowOptionsInputV31 compliant object 
 */
export function buildV31CheckboxGroup (FeGroup: FEFlowOptionGroup ): FlowOptionsInputV31
{
  const mappedOptions = FeGroup.options.map(option => ({
    id: option.optionId,
    title: option.label
  }));

  const radioGroup: FlowOptionsInputV31 = {
    type: FlowPageLayoutElementTypesV31.INLINE_CHECKBOX_INPUT,
    name: FeGroup.name,
    label: FeGroup.label,
    required: FeGroup.required,
    'data-source': mappedOptions,
    enabled: true,
    visible: true
  };

  return radioGroup;

}
