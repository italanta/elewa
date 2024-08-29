import { FlowInlineRadioButtonsInputV31, FlowPageLayoutElementTypesV31 } from "@app/model/convs-mgr/stories/flows";
import { FEFlowOptionGroup } from "../models/fe-flow-option-element.model";

/**
 * 
 * @param FeGroup Simple object that holds the options configuraton data
 * @returns A FlowInlineRadioButtonsInputV31 compliant object 
 */
export function buildV31RadioGroup (FeGroup: FEFlowOptionGroup): FlowInlineRadioButtonsInputV31
{
  const mappedOptions = FeGroup.options.map(option => ({
    id: option.optionId,
    title: option.label
  }));

  const radioGroup: FlowInlineRadioButtonsInputV31 = {
    type: FlowPageLayoutElementTypesV31.INLINE_RADIO_BUTTONS,
    name: FeGroup.name,
    label: FeGroup.label,
    required: FeGroup.required,
    'data-source': mappedOptions,
    enabled: true,
    visible: true
  };

  return radioGroup;

}